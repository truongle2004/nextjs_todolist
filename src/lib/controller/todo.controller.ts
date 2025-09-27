import type { Todo, Task } from '@/types';
import { inject, injectable } from 'tsyringe';
import type { IAuthService } from '../services/auth.service';
import type { ITodoService } from '../services/todo.service';

@injectable()
export class TodoController {
  constructor(
    @inject('ITodoService') private readonly todoService: ITodoService
  ) {}

  async getTodosByUserId(userId: number): Promise<Todo[]> {
    return await this.todoService.getTodosByUserId(userId);
  }

  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    return await this.todoService.createTodo(todo);
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    return await this.todoService.updateTodo(todo);
  }

  async deleteTodo(todoId: number): Promise<void> {
    return await this.todoService.deleteTodo(todoId);
  }

  async getTaskByTodoId(todoId: number): Promise<Task[]> {
    return await this.todoService.getTaskByTodoId(todoId);
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    return await this.todoService.createTask(task);
  }

  async updateTask(task: Task): Promise<Task> {
    return await this.todoService.updateTask(task);
  }

  async deleteTask(taskId: number): Promise<void> {
    return await this.todoService.deleteTask(taskId);
  }
}
