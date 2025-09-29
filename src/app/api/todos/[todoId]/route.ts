import 'reflect-metadata';
import { TodoController } from '@/lib/controller/todo.controller';
import { NextResponse } from 'next/server';
import { container } from 'tsyringe';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const todoController = container.resolve(TodoController);
    const todos = await todoController.getTodosByUserId(Number(params.userId));
    return NextResponse.json({ data: todos });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { todoId: string } }
) {
  try {
    const todoController = container.resolve(TodoController);
    const body = await req.json();
    const todo = await todoController.updateTodo({
      ...body,
      id: Number(params.todoId),
    });
    return NextResponse.json({ data: todo });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update todo' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { todoId: string } }
) {
  try {
    const todoController = container.resolve(TodoController);
    await todoController.deleteTodo(Number(params.todoId));
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete todo' },
      { status: 400 }
    );
  }
}
