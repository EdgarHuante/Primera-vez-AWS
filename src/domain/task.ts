export type TaskStatus = 'pendiente' | 'haciendo' | 'hecho';

export interface Task {
  id: string;
  content: string;
  status: TaskStatus;
}

export type TaskStatusTransition = {
  [K in TaskStatus]: TaskStatus | null;
};

export const STATUS_TRANSITIONS: TaskStatusTransition = {
  pendiente: 'haciendo',
  haciendo: 'hecho',
  hecho: null,
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: 'Pendiente',
  haciendo: 'Haciendo',
  hecho: 'Hecho',
};
