'use client';
import {
  createTodo,
  deleteTodo,
  getTodosByUserId,
  getTasksByTodoId,
  updateTodo,
  createTask,
} from '@/apis/todo.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, SortAsc } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TodoCard } from '@/components/TodoCard';
import { TaskForm } from '@/components/TaskForm';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  CreateTaskInput,
} from '@/types';

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addToast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/todo/login');
    }
  }, [authLoading, isAuthenticated, router]);
  
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [currentTaskTodoId, setCurrentTaskTodoId] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'progress'>(
    'created'
  );

  const { data: todosData, isLoading: todosLoading } = useQuery({
    queryKey: ['todos', user?.id],
    queryFn: () => getTodosByUserId(user!.id),
    enabled: isAuthenticated && !!user?.id,
  });

  // Fetch tasks for all todos to calculate progress
  const todoIds = todosData?.data.map((todo) => todo.id) || [];
  const tasksQueries = useQuery({
    queryKey: ['all-tasks', todoIds],
    queryFn: async () => {
      const taskPromises = todoIds.map((todoId) =>
        getTasksByTodoId(todoId).catch(() => ({ data: [] }))
      );
      const results = await Promise.all(taskPromises);
      const taskMap: Record<number, any[]> = {};
      results.forEach((result, index) => {
        taskMap[todoIds[index]] = result.data || [];
      });
      return taskMap;
    },
    enabled: todoIds.length > 0,
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsTodoModalOpen(false);
      addToast({
        type: 'success',
        title: 'Todo Created',
        message: 'Your todo has been created successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to create todo. Please try again.',
      });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsTodoModalOpen(false);
      addToast({
        type: 'success',
        title: 'Todo Updated',
        message: 'Your todo has been updated successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update todo. Please try again.',
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      addToast({
        type: 'success',
        title: 'Todo Deleted',
        message: 'Your todo has been deleted successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete todo. Please try again.',
      });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      setIsTaskModalOpen(false);
      addToast({
        type: 'success',
        title: 'Task Created',
        message: 'Your task has been created successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to create task. Please try again.',
      });
    },
  });

  const handleTodoFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (currentTodo) {
      const updateData: UpdateTodoInput = {
        id: currentTodo.id,
        title,
        description,
        completed: currentTodo.completed,
      };
      updateTodoMutation.mutate(updateData);
    } else {
      const createData: CreateTodoInput = {
        title,
        description,
        user_id: user!.id,
      };
      createTodoMutation.mutate(createData);
    }
  };

  const handleCreateTask = (taskData: CreateTaskInput) => {
    createTaskMutation.mutate(taskData);
  };

  const handleEditTodo = (todo: Todo) => {
    setCurrentTodo(todo);
    setIsTodoModalOpen(true);
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodoMutation.mutate(todoId);
  };

  const handleToggleTodoComplete = (todoId: number, completed: boolean) => {
    const todo = todosData?.data.find((t) => t.id === todoId);
    if (todo) {
      updateTodoMutation.mutate({
        id: todoId,
        title: todo.title,
        description: todo.description,
        completed,
      });
    }
  };

  const handleAddTask = (todoId: number) => {
    setCurrentTaskTodoId(todoId);
    setIsTaskModalOpen(true);
  };

  const handleViewTodo = (todoId: number) => {
    router.push(`/todo/${todoId}`);
  };

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    const todos = todosData?.data || [];
    let filtered = todos;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'created') {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === 'updated') {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      } else if (sortBy === 'progress') {
        const aProgress = calculateProgress(a.id);
        const bProgress = calculateProgress(b.id);
        return bProgress - aProgress;
      }
      return 0;
    });
  }, [todosData?.data, searchQuery, sortBy, tasksQueries.data]);

  const calculateProgress = (todoId: number) => {
    const tasks = tasksQueries.data?.[todoId] || [];
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(
      (task) => task.completed || task.status === 'done'
    ).length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Show loading while authenticating or fetching todos
  if (authLoading || !isAuthenticated) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-lg text-gray-600'>
          {authLoading ? 'Authenticating...' : 'Redirecting to login...'}
        </div>
      </div>
    );
  }
  
  if (todosLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-lg text-gray-600'>Loading your todos...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>My Todos</h1>
                <p className='text-gray-600 mt-1'>
                  Organize your tasks and boost your productivity
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentTodo(null);
                  setIsTodoModalOpen(true);
                }}
                className='inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm'
              >
                <Plus size={20} />
                Create Todo
              </button>
            </div>

            {/* Search and Filters */}
            <div className='mt-6 flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-1 max-w-md'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='text'
                  placeholder='Search todos...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <div className='flex items-center gap-2'>
                <SortAsc className='text-gray-400' size={20} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                >
                  <option value='created'>Sort by Created</option>
                  <option value='updated'>Sort by Updated</option>
                  <option value='progress'>Sort by Progress</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {filteredAndSortedTodos.length === 0 ? (
          <div className='text-center py-12'>
            <div className='max-w-md mx-auto'>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {todosData?.data.length === 0
                  ? 'No todos yet'
                  : 'No todos match your search'}
              </h3>
              <p className='text-gray-500 mb-6'>
                {todosData?.data.length === 0
                  ? 'Create your first todo to get started with organizing your tasks'
                  : "Try adjusting your search query to find what you're looking for"}
              </p>
              {todosData?.data.length === 0 && (
                <button
                  onClick={() => {
                    setCurrentTodo(null);
                    setIsTodoModalOpen(true);
                  }}
                  className='inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium'
                >
                  <Plus size={20} />
                  Create Your First Todo
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {filteredAndSortedTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                tasks={tasksQueries.data?.[todo.id] || []}
                onEditTodo={handleEditTodo}
                onDeleteTodo={handleDeleteTodo}
                onToggleTodoComplete={handleToggleTodoComplete}
                onAddTask={handleAddTask}
                onViewTodo={handleViewTodo}
                isLoading={
                  updateTodoMutation.isPending || deleteTodoMutation.isPending
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Todo Form Modal */}
      {isTodoModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-md'>
            <div className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                {currentTodo ? 'Edit Todo' : 'Create New Todo'}
              </h2>
              <form onSubmit={handleTodoFormSubmit}>
                <div className='mb-4'>
                  <label
                    htmlFor='title'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Title *
                  </label>
                  <input
                    type='text'
                    id='title'
                    name='title'
                    defaultValue={currentTodo?.title}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Enter todo title'
                    required
                  />
                </div>
                <div className='mb-6'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Description
                  </label>
                  <textarea
                    id='description'
                    name='description'
                    defaultValue={currentTodo?.description}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Todo description (optional)'
                  />
                </div>
                <div className='flex justify-end gap-3'>
                  <button
                    type='button'
                    onClick={() => setIsTodoModalOpen(false)}
                    className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    disabled={
                      createTodoMutation.isPending ||
                      updateTodoMutation.isPending
                    }
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={
                      createTodoMutation.isPending ||
                      updateTodoMutation.isPending
                    }
                  >
                    {createTodoMutation.isPending ||
                    updateTodoMutation.isPending
                      ? 'Saving...'
                      : currentTodo
                      ? 'Update Todo'
                      : 'Create Todo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {isTaskModalOpen && currentTaskTodoId && (
        <TaskForm
          todoId={currentTaskTodoId}
          onSubmit={handleCreateTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setCurrentTaskTodoId(null);
          }}
          isLoading={createTaskMutation.isPending}
        />
      )}
    </div>
  );
};

export default DashboardPage;
