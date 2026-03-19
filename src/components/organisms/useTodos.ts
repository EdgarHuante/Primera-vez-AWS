import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Schema } from '../../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { safeParse } from 'valibot';
import {
  CreateTodoSchema,
  UpdateTodoStatusSchema,
  DeleteTodoSchema,
  CreateTodoInput,
  UpdateTodoStatusInput,
} from '../../validation/todo.validation';
import type { TodoStatus } from '../../types/todo';
import { useUIStore } from '../../store/ui.store';

const client = generateClient<Schema>();

const QUERY_KEY = ['todos'] as const;

async function fetchTodos() {
  const { data: todos } = await client.models.Todo.list();
  return todos;
}

async function createTodo(input: CreateTodoInput) {
  const result = safeParse(CreateTodoSchema, input);
  if (!result.success) {
    throw new Error(result.issues.map((i) => i.message).join(', '));
  }
  return client.models.Todo.create({ content: input.content, status: 'pendiente' });
}

async function updateTodoStatus(input: UpdateTodoStatusInput) {
  const result = safeParse(UpdateTodoStatusSchema, input);
  if (!result.success) {
    throw new Error(result.issues.map((i) => i.message).join(', '));
  }
  return client.models.Todo.update({
    id: input.id,
    status: input.status as TodoStatus,
  });
}

async function deleteTodo(id: string) {
  const result = safeParse(DeleteTodoSchema, { id });
  if (!result.success) {
    throw new Error(result.issues.map((i) => i.message).join(', '));
  }
  return client.models.Todo.delete({ id });
}

export function useTodos() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchTodos,
    staleTime: 0,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const closeModal = useUIStore((state) => state.closeModal);

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      closeModal();
    },
  });
}

export function useUpdateTodoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodoStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
