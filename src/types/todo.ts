export type TodoStatus = 'pendiente' | 'haciendo' | 'hecho';

export interface Todo {
  id: string;
  content: string;
  status: TodoStatus;
}

export type TodoStatusTransition = {
  [K in TodoStatus]: TodoStatus | null;
};

export const STATUS_TRANSITIONS: TodoStatusTransition = {
  pendiente: 'haciendo',
  haciendo: 'hecho',
  hecho: null,
};

export const STATUS_LABELS: Record<TodoStatus, string> = {
  pendiente: 'Pendiente',
  haciendo: 'Haciendo',
  hecho: 'Hecho',
};
