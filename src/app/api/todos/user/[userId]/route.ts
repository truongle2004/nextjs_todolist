import 'reflect-metadata';
import { TodoController } from '@/lib/controller/todo.controller';
import { container } from '@/lib/diContainer';
import { GetTodoResponseDto } from '@/lib/dtos/response/todoResponse.dto';
import { NextResponse } from 'next/server';

export const GET = async (
  request: Request,
  { params }: { params: { userId: number } }
) => {
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
