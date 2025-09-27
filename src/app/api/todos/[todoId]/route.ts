import { container } from 'tsyringe';
import { TodoController } from '@/lib/controller/todo.controller';
import { NextResponse } from 'next/server';

const todoController = container.resolve(TodoController);

export async function GET(
  req: Request,
  { params }: { params: { todoId: string } }
) {
  try {
    const todo = await todoController.getTodoById(Number(params.todoId));
    return NextResponse.json({ data: todo });
  } catch (error) {
    return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { todoId: string } }
) {
  try {
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
    await todoController.deleteTodo(Number(params.todoId));
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete todo' },
      { status: 400 }
    );
  }
}
