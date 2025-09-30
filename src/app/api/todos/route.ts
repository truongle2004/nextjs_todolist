import 'reflect-metadata';
import { TodoController } from '@/lib/controller/todo.controller';
import { container } from '@/lib/diContainer';
import { NextResponse } from 'next/server';

const todoController = container.resolve(TodoController);

export async function POST(req: Request) {
  const body = await req.json();
  const todo = await todoController.createTodo(body);
  return NextResponse.json(todo);
}
