'use client';
import { ArrowLeft, Plus, Filter, SortAsc, Eye, EyeOff } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  getTodoById,
  getTasksByTodoId,
  updateTodo,
  createTask,
  updateTask,
  deleteTask,
} from '@/apis/todo.api';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { StatusEnum } from '@/enums/taskStatus.enum';
import { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types';
import {
  calculateTodoProgress,
  formatDateTime,
  sortTasksByPriority,
  sortTasksByDueDate,
  filterTasksByStatus,
  filterTasksByPriority,
  filterOverdueTasks,
  filterDueSoonTasks,
} from '@/utils/taskUtils';

type SortOption = 'priority' | 'dueDate' | 'created' | 'updated';
type FilterOption = 'all' | 'active' | 'completed' | 'overdue' | 'dueSoon';

const TodoDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const todoId = Number(params.id);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [statusFilter, setStatusFilter] = useState<StatusEnum | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityEnum | undefined>();
  const [showCompleted, setShowCompleted] = useState(true);

  // Fetch todo details
  const { data: todoData, isLoading: todoLoading } = useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => getTodoById(todoId),
    enabled: !!todoId,
  });

  // Fetch tasks for this todo
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', todoId],
    queryFn: () => getTasksByTodoId(todoId),
    enabled: !!todoId,
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsTaskFormOpen(false);
      setCurrentTask(undefined);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsTaskFormOpen(false);
      setCurrentTask(undefined);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Handlers
  const handleCreateTask = (taskData: CreateTaskInput) => {
    createTaskMutation.mutate(taskData);
  };

  const handleUpdateTask = (taskData: UpdateTaskInput) => {
    updateTaskMutation.mutate(taskData);
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleToggleTaskComplete = (taskId: number, completed: boolean) => {
    const task = tasks?.find(t => t.id === taskId);
    if (task) {
      updateTaskMutation.mutate({
        id: taskId,
        title: task.title,
        description: task.description,
        completed,
        status: completed ? StatusEnum.DONE : StatusEnum.TODO,
        priority: task.priority,
        due_date: task.due_date,
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskFormOpen(true);
  };

  const handleAddTask = () => {
    setCurrentTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleToggleTodoComplete = () => {
    if (todoData?.data) {
      updateTodoMutation.mutate({
        id: todoData.data.id,
        title: todoData.data.title,
        description: todoData.data.description,
        completed: !todoData.data.completed,
      });
    }
  };

  // Process and filter tasks
  const tasks = tasksData?.data || [];
  const todo = todoData?.data;
  const progress = calculateTodoProgress(tasks);

  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = [...tasks];

    // Apply filters
    if (filterBy === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed && task.status !== StatusEnum.DONE);
    } else if (filterBy === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed || task.status === StatusEnum.DONE);
    } else if (filterBy === 'overdue') {
      filteredTasks = filterOverdueTasks(filteredTasks);
    } else if (filterBy === 'dueSoon') {
      filteredTasks = filterDueSoonTasks(filteredTasks);
    }

    // Apply status filter
    if (statusFilter) {
      filteredTasks = filterTasksByStatus(filteredTasks, statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== undefined) {
      filteredTasks = filterTasksByPriority(filteredTasks, priorityFilter);
    }

    // Show/hide completed tasks
    if (!showCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.completed && task.status !== StatusEnum.DONE);
    }

    // Sort tasks
    if (sortBy === 'priority') {
      return sortTasksByPriority(filteredTasks);
    } else if (sortBy === 'dueDate') {
      return sortTasksByDueDate(filteredTasks);
    } else if (sortBy === 'created') {
      return filteredTasks.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === 'updated') {
      return filteredTasks.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }

    return filteredTasks;
  }, [tasks, filterBy, statusFilter, priorityFilter, showCompleted, sortBy]);

  const getFilterCount = (filter: FilterOption) => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed && task.status !== StatusEnum.DONE).length;
      case 'completed':
        return tasks.filter(task => task.completed || task.status === StatusEnum.DONE).length;
      case 'overdue':
        return filterOverdueTasks(tasks).length;
      case 'dueSoon':
        return filterDueSoonTasks(tasks).length;
      default:
        return tasks.length;
    }
  };

  if (todoLoading) return <div className="p-8">Loading todo...</div>;
  if (!todo) return <div className="p-8">Todo not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className={`text-2xl font-bold ${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {todo.title}
                  </h1>
                  {todo.description && (
                    <p className="text-gray-600 mt-1">{todo.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Created {formatDateTime(todo.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleTodoComplete}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    todo.completed
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button
                  onClick={handleAddTask}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">
                  {progress.completed}/{progress.total} tasks completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    progress.percentage === 100
                      ? 'bg-green-500'
                      : progress.percentage >= 70
                        ? 'bg-blue-500'
                        : progress.percentage >= 40
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                  }`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-sm font-medium text-gray-700">
                  {progress.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1">
                {(['all', 'active', 'completed', 'overdue', 'dueSoon'] as FilterOption[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterBy(filter)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      filterBy === filter
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1).replace(/([A-Z])/g, ' $1')} ({getFilterCount(filter)})
                  </button>
                ))}
              </div>

              {/* Additional Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value as StatusEnum || undefined)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="">All Status</option>
                  <option value={StatusEnum.TODO}>To Do</option>
                  <option value={StatusEnum.IN_PROGRESS}>In Progress</option>
                  <option value={StatusEnum.DONE}>Done</option>
                </select>

                <select
                  value={priorityFilter ?? ''}
                  onChange={(e) => setPriorityFilter(e.target.value ? Number(e.target.value) as TaskPriorityEnum : undefined)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="">All Priority</option>
                  <option value={TaskPriorityEnum.LOW}>Low Priority</option>
                  <option value={TaskPriorityEnum.MEDIUM}>Medium Priority</option>
                  <option value={TaskPriorityEnum.HIGH}>High Priority</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  showCompleted
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {showCompleted ? <Eye size={14} /> : <EyeOff size={14} />}
                {showCompleted ? 'Hide' : 'Show'} Completed
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="priority">Sort by Priority</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="created">Sort by Created</option>
                <option value="updated">Sort by Updated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tasksLoading ? (
          <div className="text-center py-8">Loading tasks...</div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {tasks.length === 0 
                ? "No tasks yet. Create your first task to get started!"
                : "No tasks match the current filters."
              }
            </p>
            {tasks.length === 0 && (
              <button
                onClick={handleAddTask}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add First Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onToggleComplete={handleToggleTaskComplete}
                onUpdateTask={handleUpdateTask}
                isLoading={updateTaskMutation.isPending || deleteTaskMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <TaskForm
          task={currentTask}
          todoId={todoId}
          onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setIsTaskFormOpen(false);
            setCurrentTask(undefined);
          }}
          isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
        />
      )}
    </div>
  );
};

export default TodoDetailPage;
