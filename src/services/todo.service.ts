import { safeParse } from 'valibot';
import { generateClient } from 'aws-amplify/data';
import {
  CreateTodoSchema,
  UpdateTodoStatusSchema,
  UpdateTodoContentSchema,
  DeleteTodoSchema,
  type CreateTodoInput,
  type UpdateTodoStatusInput,
  type UpdateTodoContentInput,
} from '@validation/todo.validation';
import type { TaskStatus } from '@domain/task';

const apiClient = generateClient();

export interface TaskResponse {
  id: string;
  content: string;
  status: TaskStatus;
}

export const todoService = {
  async getAll(): Promise<TaskResponse[]> {
    const result = await apiClient.models.Todo.list();
    return result.data.map((todo) => ({
      id: todo.id,
      content: todo.content || '',
      status: todo.status || 'pendiente',
    }));
  },

  async create(input: CreateTodoInput): Promise<TaskResponse> {
    const result = safeParse(CreateTodoSchema, input);
    if (!result.success) {
      throw new Error(result.issues.map((i) => i.message).join(', '));
    }
    const response = await apiClient.models.Todo.create({
      content: result.output.content,
      status: 'pendiente',
    });
    if (!response.data) throw new Error('Failed to create todo');
    return {
      id: response.data.id,
      content: response.data.content || '',
      status: response.data.status || 'pendiente',
    };
  },

  async updateStatus(input: UpdateTodoStatusInput): Promise<TaskResponse> {
    const result = safeParse(UpdateTodoStatusSchema, input);
    if (!result.success) {
      throw new Error(result.issues.map((i) => i.message).join(', '));
    }
    const response = await apiClient.models.Todo.update({
      id: result.output.id,
      status: result.output.status,
    });
    if (!response.data) throw new Error('Failed to update todo');
    return {
      id: response.data.id,
      content: response.data.content || '',
      status: response.data.status || 'pendiente',
    };
  },

  async updateContent(input: UpdateTodoContentInput): Promise<TaskResponse> {
    const result = safeParse(UpdateTodoContentSchema, input);
    if (!result.success) {
      throw new Error(result.issues.map((i) => i.message).join(', '));
    }
    const response = await apiClient.models.Todo.update({
      id: result.output.id,
      content: result.output.content,
    });
    if (!response.data) throw new Error('Failed to update todo');
    return {
      id: response.data.id,
      content: response.data.content || '',
      status: response.data.status || 'pendiente',
    };
  },

  async delete(id: string): Promise<void> {
    const result = safeParse(DeleteTodoSchema, { id });
    if (!result.success) {
      throw new Error(result.issues.map((i) => i.message).join(', '));
    }
    await apiClient.models.Todo.delete({ id });
  },
};
