'use client';

import {
  createTask,
  deleteTask,
  getTasksByTodoId,
  updateTask,
  updateTodo,
} from '@/apis/todo.api';
import { TaskItem } from '@/components';
import { TaskForm } from '@/components/TaskForm';
import { StatusEnum } from '@/enums/taskStatus.enum';
import type { CreateTaskInput, Task, UpdateTaskInput } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Empty, Button } from 'antd';
import useAuthStore from '@/store/authStore';

const TodoDetailPage = () => {
  const params = useParams();
  const router = useRouter();

  const queryClient = useQueryClient();
  const todoId = Number(params.id);
  const { isLoggedIn } = useAuthStore();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>();

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', todoId],
    queryFn: () => getTasksByTodoId(todoId),
    enabled: !!todoId,
  });

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
    const task = tasks?.find((t) => t.id === taskId);
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

  const tasks = tasksData?.data || [];

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/todo/login');
    }
  }, [isLoggedIn()]);

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      {/* Header */}
      <div className='bg-white shadow-sm border rounded-lg p-6 space-y-4'>
        {tasksLoading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <Empty
            description='No tasks found'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type='primary' onClick={handleAddTask}>
              Add Task
            </Button>
          </Empty>
        ) : (
          <div className='space-y-3'>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onToggleComplete={handleToggleTaskComplete}
                onUpdateTask={handleUpdateTask}
                isLoading={
                  updateTaskMutation.isPending || deleteTaskMutation.isPending
                }
              />
            ))}
          </div>
        )}

        {/* Task Form Modal */}
        {isTaskFormOpen && (
          <TaskForm
            task={currentTask}
            todoId={todoId}
            handleCreateTask={handleCreateTask}
            handleUpdateTask={handleUpdateTask}
            onClose={() => {
              setIsTaskFormOpen(false);
              setCurrentTask(undefined);
            }}
            isLoading={
              createTaskMutation.isPending || updateTaskMutation.isPending
            }
          />
        )}
      </div>
    </div>
  );
};

export default TodoDetailPage;
