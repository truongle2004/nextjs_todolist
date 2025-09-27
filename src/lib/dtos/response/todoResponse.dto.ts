import type { Todo } from '@/types';
import { GenericResponse } from '@/utils/genericResponse';

export class GetTodoResponseDto extends GenericResponse<Todo[]> {
  constructor(status: number, message: string, data: Todo[]) {
    super(status, message, data);
  }
}
