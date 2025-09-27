import { container } from 'tsyringe';
import { TodoController } from '@/lib/controller/todo.controller';
import { NextResponse } from 'next/server';

const todoController = container.resolve(TodoController);

export async function GET(req: Request, { params }: { params: { todoId: string } }) {
  const tasks = await todoController.getTaskByTodoId(Number(params.todoId));
  return NextResponse.json(tasks);
}