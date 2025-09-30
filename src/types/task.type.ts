import type { StatusEnum } from '@/enums/taskStatus.enum';
import type { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import dayjs from 'dayjs';

export interface Task {
  id: number;
  todo_id: number;
  title: string;
  description?: string;
  completed: boolean;
  status: StatusEnum;
  priority: TaskPriorityEnum;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  todo_id: number;
  title: string;
  description?: string;
  status?: StatusEnum;
  priority?: TaskPriorityEnum;
  due_date?: string;
}

export interface UpdateTaskInput {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  status: StatusEnum;
  priority: TaskPriorityEnum;
  due_date?: string;
}
