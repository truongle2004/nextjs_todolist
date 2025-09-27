import type { Todo, Task } from '@/types';

export interface ITodoDb {
  getTodosByUserId(userId: number): Promise<Todo[]>;
  getTaskByTodoId(todoId: number): Promise<Task[]>;
  createTodo(todo: Omit<Todo, 'id'>): Promise<Todo>;
  updateTodo(todo: Todo): Promise<Todo>;
  deleteTodo(todoId: number): Promise<void>;
  createTask(task: Omit<Task, 'id'>): Promise<Task>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(taskId: number): Promise<void>;
}
