import { container } from 'tsyringe';
import { TodoController } from '@/lib/controller/todo.controller';
import { NextResponse } from 'next/server';

const todoController = container.resolve(TodoController);

export async function PUT(req: Request, { params }: { params: { taskId: string } }) {
  const body = await req.json();
  const task = await todoController.updateTask({ ...body, id: params.taskId });
  return NextResponse.json(task);
}

export async function DELETE(req: Request, { params }: { params: { taskId: string } }) {
  await todoController.deleteTask(Number(params.taskId));
  return NextResponse.json({ message: 'Task deleted successfully' });
}