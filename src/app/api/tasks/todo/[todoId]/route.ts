import 'reflect-metadata';
import { TodoController } from '@/lib/controller/todo.controller';
import { NextResponse } from 'next/server';
import { container } from '@/lib/diContainer';
import { GetTaskResponseDto } from '@/lib/dtos/response/taskResponse.dto';

export async function GET(
  req: Request,
  { params }: { params: { todoId: string } }
) {
  const todoController = container.resolve(TodoController);
  const tasks = await todoController.getTaskByTodoId(Number(params.todoId));
  const response = new GetTaskResponseDto(200, 'Success', tasks);
  return NextResponse.json(response);
}
