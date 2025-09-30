'use client';
import {
  createTask,
  deleteTask,
  getTasksByTodoId,
  updateTask,
} from '@/apis/todo.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const ListTask = ({ todoId }: { todoId: number }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', todoId],
    queryFn: () => getTasksByTodoId(todoId),
    enabled: !isCollapsed,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', todoId] });
      setIsModalOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', todoId] });
      setIsModalOpen(false);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', todoId] });
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (currentTask) {
      updateTaskMutation.mutate({ ...currentTask, title, description });
    } else {
      createTaskMutation.mutate({ title, description, todo_id: todoId });
    }
  };

  return (
    <div className='mt-4'>
      <div
        className='flex justify-between items-center mb-2 cursor-pointer'
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className='text-lg font-semibold'>Tasks</h3>
        <div className='flex items-center gap-2'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentTask(null);
              setIsModalOpen(true);
            }}
            className='bg-green-500 text-white p-1 rounded-full'
          >
            <Plus size={16} />
          </button>
          <ChevronDown
            className={`transform transition-transform ${
              isCollapsed ? '' : 'rotate-180'
            }`}
          />
        </div>
      </div>
      {!isCollapsed && (
        <>
          {isLoading ? (
            <div>Loading tasks...</div>
          ) : (
            <ul className='space-y-2'>
              {data?.data.map((task: any) => (
                <li key={task.id} className='bg-gray-100 p-2 rounded-md'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>{task.title}</span>
                    <div className='flex gap-2'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTask(task);
                          setIsModalOpen(true);
                        }}
                        className='text-blue-500'
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTaskMutation.mutate(task.id);
                        }}
                        className='text-red-500'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className='text-gray-500 text-sm'>{task.description}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-8 rounded-lg'>
            <h2 className='text-2xl font-bold mb-4'>
              {currentTask ? 'Update Task' : 'Create Task'}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className='mb-4'>
                <label
                  htmlFor='title'
                  className='block text-sm font-medium text-gray-700'
                >
                  Title
                </label>
                <input
                  type='text'
                  id='title'
                  name='title'
                  defaultValue={currentTask?.title}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  required
                />
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  defaultValue={currentTask?.description}
                  rows={3}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                />
              </div>
              <div className='flex justify-end gap-4'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='bg-gray-300 text-black p-2 rounded-md'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-blue-500 text-white p-2 rounded-md'
                >
                  {currentTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
