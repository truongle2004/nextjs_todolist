'use client';

import {
  createTask,
  createTodo,
  deleteTodo,
  getTodosByUserId,
  updateTodo,
} from '@/apis/todo.api';
import { TaskForm } from '@/components/TaskForm';
import { TodoForm } from '@/components/TodoForm';
import { TodoCard } from '@/components/TodoCard';
import useAuthStore from '@/store/authStore';
import type { CreateTaskInput } from '@/types/task.type';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '@/types/todo.type';
import { errorToast } from '@/utils/toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const { getUserId, isLoggedIn } = useAuthStore();
  const userId = getUserId();
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
      setCurrentTodo(null);
    },
    onError: (err) => {
      errorToast(err.message);
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsTodoModalOpen(false);
      setCurrentTodo(null);
    },
    onError: (err) => {
      errorToast(err.message);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
    },
    onError: (err) => {
      errorToast(err.message);
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      setIsTaskModalOpen(false);
    },
    onError: (err) => {
      errorToast(err.message);
    },
  });

  const handleCreateTodo = (todoData: CreateTodoInput) => {
    createTodoMutation.mutate(todoData);
  };

  const handleUpdateTodo = (todoData: UpdateTodoInput) => {
    updateTodoMutation.mutate(todoData);
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
    if (!isLoggedIn()) {
      router.push('/todo/login');
    }
  }, [isLoggedIn(), router]);

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
        <TodoForm
          todo={currentTodo || undefined}
          userId={userId as number}
          handleCreateTodo={handleCreateTodo}
          handleUpdateTodo={handleUpdateTodo}
          onClose={() => {
            setIsTodoModalOpen(false);
            setCurrentTodo(null);
          }}
          isLoading={
            createTodoMutation.isPending || updateTodoMutation.isPending
          }
        />
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
