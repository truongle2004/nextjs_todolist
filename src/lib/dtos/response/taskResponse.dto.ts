import type { Task, Todo } from '@/types';
import { GenericResponse } from '@/utils/genericResponse';

export class GetTaskResponseDto extends GenericResponse<Task[]> {
  constructor(status: number, message: string, data: Task[]) {
    super(status, message, data);
  }
}
