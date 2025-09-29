import type {
  Todo,
  Task,
  CreateTodoInput,
  UpdateTodoInput,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/types';
import { StatusEnum } from '@/enums/taskStatus.enum';
import { TaskPriorityEnum } from '@/enums/taskPriority.enum';
import axiosInstance from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/apiResponse.type';

export const getAllTodos = async (userId: number) => {
  const { data } = await axiosInstance.get<{ data: Todo[] }>(
    `/todos/${userId}`
  );
  return data;
};

export const getTodoById = async (
  todoId: number
): Promise<ApiResponse<Todo>> => {
  return await axiosInstance.get(`/todos/${todoId}`);
};

export const getTodosByUserId = async (
  userId: number
): Promise<ApiResponse<Todo[]>> => {
  return await axiosInstance.get(`/todos/user/${userId}`);
};

export const createTodo = async (todo: CreateTodoInput) => {
  const { data } = await axiosInstance.post<{ data: Todo }>('/todos', {
    ...todo,
    completed: false,
  });
  return data;
};

export const updateTodo = async (todo: UpdateTodoInput) => {
  const { data } = await axiosInstance.put<{ data: Todo }>(
    `/todos/${todo.id}`,
    todo
  );
  return data;
};

export const deleteTodo = async (todoId: number) => {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/todos/${todoId}`
  );
  return data;
};

export const getAllTasks = async () => {
  const { data } = await axiosInstance.get<{ data: Task[] }>('/tasks');
  return data;
};

export const getTaskById = async (taskId: number) => {
  const { data } = await axiosInstance.get<{ data: Task }>(`/tasks/${taskId}`);
  return data;
};

export const getTasksByTodoId = async (
  todoId: number
): Promise<ApiResponse<Task[]>> => {
  return await axiosInstance.get(`/tasks/todo/${todoId}`);
};

export const createTask = async (task: CreateTaskInput) => {
  const { data } = await axiosInstance.post<{ data: Task }>('/tasks', {
    ...task,
    completed: false,
    status: task.status || StatusEnum.TODO,
    priority: task.priority || TaskPriorityEnum.MEDIUM,
  });
  return data;
};

export const updateTask = async (task: UpdateTaskInput) => {
  const { data } = await axiosInstance.put<{ data: Task }>(
    `/tasks/${task.id}`,
    task
  );
  return data;
};

export const deleteTask = async (taskId: number) => {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/tasks/${taskId}`
  );
  return data;
};
