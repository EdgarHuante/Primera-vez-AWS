import type { TaskStatus } from '@domain/task';

export interface AmplifyTodo {
  id: string;
  content?: string;
  status?: TaskStatus;
}

export interface AmplifyModels {
  Todo: {
    list: () => Promise<{ data: AmplifyTodo[] }>;
    create: (data: { content: string; status: TaskStatus }) => Promise<{ data: AmplifyTodo }>;
    update: (data: { id: string; status?: TaskStatus; content?: string }) => Promise<{ data: AmplifyTodo }>;
    delete: (data: { id: string }) => Promise<unknown>;
  };
}

export interface AmplifyClient {
  models: AmplifyModels;
}

declare module 'aws-amplify/data' {
  export function generateClient(): AmplifyClient;
}
