import 'reflect-metadata';
import { GetTodoResponseDto } from '@/lib/dtos/response/todoResponse.dto';
import type { ITodoService } from '@/lib/services/todo.service';
import { NextResponse } from 'next/server';
import { TodoServiceImpl } from '@/lib/services/impl/todo.service.impl';
import { TodoController } from '@/lib/controller/todo.controller';
import { container } from '@/lib/diContainer';

export const GET = async (
  request: Request,
  { params }: { params: { userId: number } }
) => {
  // TODO: validate userId
  const todoController = container.resolve(TodoController);
  try {
    const data = await todoController.getTodosByUserId(params.userId);
    const response = new GetTodoResponseDto(200, 'success', data);
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Internal server error',
        data: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
};
