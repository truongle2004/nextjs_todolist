'use client';

import {
  createTask,
  createTodo,
  deleteTodo,
  getTodosByUserId,
  updateTodo,
} from '@/apis/todo.api';
import { TodoCard } from '@/components';
import { TaskForm } from '@/components/TaskForm';
import useAuthStore from '@/store/authStore';
import type {
  CreateTaskInput,
  CreateTodoInput,
  Todo,
  UpdateTodoInput,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const { userId, isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [currentTaskTodoId, setCurrentTaskTodoId] = useState<number | null>(
    null
  );

  const { data: todosData, isPending: todosLoading } = useQuery({
    queryKey: ['todos', userId],
    queryFn: () => getTodosByUserId(userId as number),
    enabled: !!userId && userId !== null,
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsTodoModalOpen(false);
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsTodoModalOpen(false);
    },
    onError: () => {},
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
    },
    onError: () => {},
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      setIsTaskModalOpen(false);
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
        user_id: userId as number,
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

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/todo/login');
    }
  }, [isLoggedIn, router]);

  if (todosLoading || todosData === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
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
          </div>
        </div>
      </div>

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

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='py-6'>
          {todosData?.data?.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No todos yet</p>
              <p className='text-gray-400 text-sm mt-2'>
                Create your first todo to get started
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {todosData?.data?.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  tasks={[]}
                  onEditTodo={handleEditTodo}
                  onDeleteTodo={handleDeleteTodo}
                  onToggleTodoComplete={handleToggleTodoComplete}
                  onAddTask={handleAddTask}
                  onViewTodo={handleViewTodo}
                  isLoading={todosLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isTaskModalOpen && currentTaskTodoId && (
        <TaskForm
          todoId={currentTaskTodoId}
          handleCreateTask={handleCreateTask}
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
