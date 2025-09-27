export interface Todo {
  id: number;
  title: string;
  description?: string;
  user_id: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  user_id: number;
}

export interface UpdateTodoInput {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}
