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

// Todo APIs
export const getAllTodos = async () => {
  const { data } = await axiosInstance.get<{ data: Todo[] }>('/todos');
  return data;
};

export const getTodoById = async (todoId: number) => {
  const { data } = await axiosInstance.get<{ data: Todo }>(`/todos/${todoId}`);
  return data;
};

export const getTodosByUserId = async (userId: number) => {
  const { data } = await axiosInstance.get<{ data: Todo[] }>(
    `/todos/user/${userId}`
  );
  return data;
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

// Task APIs
export const getAllTasks = async () => {
  const { data } = await axiosInstance.get<{ data: Task[] }>('/tasks');
  return data;
};

export const getTaskById = async (taskId: number) => {
  const { data } = await axiosInstance.get<{ data: Task }>(`/tasks/${taskId}`);
  return data;
};

export const getTasksByTodoId = async (todoId: number) => {
  const { data } = await axiosInstance.get<{ data: Task[] }>(
    `/tasks/todo/${todoId}`
  );
  return data;
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
