import { StatusEnum } from '@/enums/taskStatus.enum';
import { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import type { Task, Todo } from '@/types';

export const getPriorityLabel = (priority: TaskPriorityEnum): string => {
  switch (priority) {
    case TaskPriorityEnum.LOW:
      return 'Low';
    case TaskPriorityEnum.MEDIUM:
      return 'Medium';
    case TaskPriorityEnum.HIGH:
      return 'High';
    default:
      return 'Unknown';
  }
};

export const getPriorityColor = (priority: TaskPriorityEnum): string => {
  switch (priority) {
    case TaskPriorityEnum.LOW:
      return 'bg-green-100 text-green-800 border-green-200';
    case TaskPriorityEnum.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case TaskPriorityEnum.HIGH:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityIcon = (priority: TaskPriorityEnum): string => {
  switch (priority) {
    case TaskPriorityEnum.LOW:
      return '🟢';
    case TaskPriorityEnum.MEDIUM:
      return '🟡';
    case TaskPriorityEnum.HIGH:
      return '🔴';
    default:
      return '⚪';
  }
};

export const getStatusLabel = (status: StatusEnum): string => {
  switch (status) {
    case StatusEnum.TODO:
      return 'To Do';
    case StatusEnum.IN_PROGRESS:
      return 'In Progress';
    case StatusEnum.DONE:
      return 'Done';
    default:
      return 'Unknown';
  }
};

export const getStatusColor = (status: StatusEnum): string => {
  switch (status) {
    case StatusEnum.TODO:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case StatusEnum.IN_PROGRESS:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case StatusEnum.DONE:
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIcon = (status: StatusEnum): string => {
  switch (status) {
    case StatusEnum.TODO:
      return '📝';
    case StatusEnum.IN_PROGRESS:
      return '⏳';
    case StatusEnum.DONE:
      return '✅';
    default:
      return '❓';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (dueDate: string): boolean => {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
};

export const isDueSoon = (dueDate: string, daysAhead: number = 3): boolean => {
  const due = new Date(dueDate);
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return due >= today && due <= future;
};
