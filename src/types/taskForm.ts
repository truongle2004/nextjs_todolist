import type { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import type { StatusEnum } from '@/enums/taskStatus.enum';

interface TaskFormData {
  title: string;
  description?: string;
  status: StatusEnum;
  priority: TaskPriorityEnum;
  due_date?: string;
  completed?: boolean;
}

export type { TaskFormData };
