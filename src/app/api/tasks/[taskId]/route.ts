import 'reflect-metadata';
import { TodoController } from '@/lib/controller/todo.controller';
import { NextResponse } from 'next/server';
import { container } from '@/lib/diContainer';

export async function PUT(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const todoController = container.resolve(TodoController);
  const body = await req.json();
  const task = await todoController.updateTask({ ...body, id: params.taskId });
  return NextResponse.json(task);
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const todoController = container.resolve(TodoController);
  await todoController.deleteTask(Number(params.taskId));
  return NextResponse.json({ message: 'Task deleted successfully' });
}
