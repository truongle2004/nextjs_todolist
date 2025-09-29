'use client';
import { StatusEnum } from '@/enums/taskStatus.enum';
import { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types';
import { X, Calendar, Flag, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TaskFormProps {
  task?: Task;
  todoId: number;
  handleCreateTask: (taskData: CreateTaskInput) => void;
  handleUpdateTask?: (taskData: UpdateTaskInput) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  todoId,
  handleUpdateTask,
  handleCreateTask,
  onClose,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || StatusEnum.TODO,
    priority: task?.priority || TaskPriorityEnum.MEDIUM,
    due_date: task?.due_date ? task.due_date.split('T')[0] : '',
    completed: task?.completed || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (task) {
      // Update existing task
      const updateData: UpdateTaskInput = {
        id: task.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
        completed: formData.completed,
      };
      if (handleUpdateTask) handleUpdateTask(updateData);
    } else {
      // Create new task
      const createData: CreateTaskInput = {
        todo_id: todoId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
      };
      handleCreateTask(createData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: TaskPriorityEnum) => {
    switch (priority) {
      case TaskPriorityEnum.LOW:
        return 'text-green-600 bg-green-50 border-green-200';
      case TaskPriorityEnum.MEDIUM:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case TaskPriorityEnum.HIGH:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: StatusEnum) => {
    switch (status) {
      case StatusEnum.TODO:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case StatusEnum.IN_PROGRESS:
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case StatusEnum.DONE:
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Title */}
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Task Title *
            </label>
            <input
              type='text'
              id='title'
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter task title'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Description
            </label>
            <textarea
              id='description'
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Task description (optional)'
            />
          </div>

          {/* Status and Priority Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Status */}
            <div>
              <label
                htmlFor='status'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Status
              </label>
              <select
                id='status'
                value={formData.status}
                onChange={(e) =>
                  handleInputChange('status', e.target.value as StatusEnum)
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getStatusColor(
                  formData.status
                )}`}
              >
                <option value={StatusEnum.TODO}>📝 To Do</option>
                <option value={StatusEnum.IN_PROGRESS}>⏳ In Progress</option>
                <option value={StatusEnum.DONE}>✅ Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor='priority'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Priority
              </label>
              <select
                id='priority'
                value={formData.priority}
                onChange={(e) =>
                  handleInputChange(
                    'priority',
                    Number(e.target.value) as TaskPriorityEnum
                  )
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getPriorityColor(
                  formData.priority
                )}`}
              >
                <option value={TaskPriorityEnum.LOW}>🟢 Low Priority</option>
                <option value={TaskPriorityEnum.MEDIUM}>
                  🟡 Medium Priority
                </option>
                <option value={TaskPriorityEnum.HIGH}>🔴 High Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor='due_date'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              <Calendar className='inline w-4 h-4 mr-1' />
              Due Date
            </label>
            <input
              type='date'
              id='due_date'
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {task && (
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='completed'
                checked={formData.completed}
                onChange={(e) =>
                  handleInputChange('completed', e.target.checked)
                }
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label
                htmlFor='completed'
                className='ml-2 block text-sm text-gray-700'
              >
                <CheckCircle className='inline w-4 h-4 mr-1' />
                Mark as completed
              </label>
            </div>
          )}

          <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
