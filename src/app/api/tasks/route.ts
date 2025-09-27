import { container } from 'tsyringe';
import { TodoController } from '@/lib/controller/todo.controller';
import { NextResponse } from 'next/server';

const todoController = container.resolve(TodoController);

export async function POST(req: Request) {
  const body = await req.json();
  const task = await todoController.createTask(body);
  return NextResponse.json(task);
}