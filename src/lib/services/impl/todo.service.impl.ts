import type { Task, Todo } from '@/types';
import type { ITodoService } from '../todo.service';
import { inject, injectable } from 'tsyringe';
import type { ITodoDb } from '@/lib/db/todo.db';

@injectable()
export class TodoServiceImpl implements ITodoService {
  constructor(@inject('ITodoDb') private readonly todoDb: ITodoDb) {}
  async getTodosByUserId(userId: number): Promise<Todo[]> {
    return await this.todoDb.getTodosByUserId(userId);
  }
  async getTaskByTodoId(todoId: number): Promise<Task[]> {
    return await this.todoDb.getTaskByTodoId(todoId);
  }
  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    return await this.todoDb.createTodo(todo);
  }
  async updateTodo(todo: Todo): Promise<Todo> {
    return await this.todoDb.updateTodo(todo);
  }
  async deleteTodo(todoId: number): Promise<void> {
    return await this.todoDb.deleteTodo(todoId);
  }
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    return await this.todoDb.createTask(task);
  }
  async updateTask(task: Task): Promise<Task> {
    return await this.todoDb.updateTask(task);
  }
  async deleteTask(taskId: number): Promise<void> {
    return await this.todoDb.deleteTask(taskId);
  }
}
