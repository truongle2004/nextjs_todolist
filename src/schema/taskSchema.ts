import { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import { StatusEnum } from '@/enums/taskStatus.enum';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
  status: z.enum(StatusEnum),
  priority: z.enum(TaskPriorityEnum),
  due_date: z.string().datetime().optional().or(z.literal(undefined)),
  completed: z.boolean().optional(),
});

export default taskSchema;
