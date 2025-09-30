import type z from 'zod';
import type { TaskSchema } from '../schemes/task.scheme';

export type TaskType = z.infer<typeof TaskSchema>;
