import type { ISupabaseService } from '@/lib/services/supabase.service';
import type { Task, Todo } from '@/types';
import { inject, injectable } from 'tsyringe';
import type { ITodoDb } from '../todo.db';
import { logger } from '@/configs/logger.config';

@injectable()
export class TodoDbImpl implements ITodoDb {
  private TODO_TABLE = 'todos';
  private TASK_TABLE = 'tasks';

  constructor(
    @inject('ISupabaseService')
    private readonly supabaseService: ISupabaseService
  ) {}

  async getTodosByUserId(userId: number): Promise<Todo[]> {
    const supabase = await this.supabaseService.getClient();
    const { data: todos } = await supabase
      .from(this.TODO_TABLE)
      .select('*')
      .eq('user_id', userId);

    const res = todos as Todo[];
    return res;
  }

  async getTaskByTodoId(todoId: number): Promise<Task[]> {
    const supabase = await this.supabaseService.getClient();
    const { data: tasks } = await supabase
      .from(this.TASK_TABLE)
      .select('*')
      .eq('todo_id', todoId);

    const res = tasks as Task[];
    return res;
  }

  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    console.log(todo);
    const supabase = await this.supabaseService.getClient();
    const { data, error } = await supabase
      .from(this.TODO_TABLE)
      .insert(todo)
      .select();
    if (error) {
      console.log(error);
    }
    return data![0] as Todo;
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    const supabase = await this.supabaseService.getClient();
    const { data } = await supabase
      .from(this.TODO_TABLE)
      .update(todo)
      .eq('id', todo.id)
      .select();
    return data![0] as Todo;
  }

  async deleteTodo(todoId: number): Promise<void> {
    const supabase = await this.supabaseService.getClient();
    await supabase.from(this.TODO_TABLE).delete().eq('id', todoId);
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const supabase = await this.supabaseService.getClient();
    const { data } = await supabase.from(this.TASK_TABLE).insert(task).select();
    return data![0] as Task;
  }

  async updateTask(task: Task, id: number): Promise<Task> {
    const { id: _, ...updateTask } = task;
    const supabase = await this.supabaseService.getClient();
    const { data, error } = await supabase
      .from(this.TASK_TABLE)
      .update(updateTask)
      .eq('id', id)
      .select();

    console.log(error);
    return data![0] as Task;
  }

  async deleteTask(taskId: number): Promise<void> {
    const supabase = await this.supabaseService.getClient();
    await supabase.from(this.TASK_TABLE).delete().eq('id', taskId);
  }
}
