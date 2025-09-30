import type { Task } from '@/types/task.type';
import type { Todo } from '@/types/todo.type';

export interface ITodoDb {
  getTodosByUserId(userId: number): Promise<Todo[]>;
  getTaskByTodoId(todoId: number): Promise<Task[]>;
  createTodo(todo: Omit<Todo, 'id'>): Promise<Todo>;
  updateTodo(todo: Todo): Promise<Todo>;
  deleteTodo(todoId: number): Promise<void>;
  createTask(task: Omit<Task, 'id'>): Promise<Task>;
  updateTask(task: Task, id: number): Promise<Task>;
  deleteTask(taskId: number): Promise<void>;
}
