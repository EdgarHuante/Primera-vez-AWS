import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@services/todo.service';
import type { CreateTodoInput, UpdateTodoStatusInput, UpdateTodoContentInput } from '@validation/todo.validation';

const QUERY_KEY = ['todos'] as const;

export function useTodos() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: todoService.getAll,
    staleTime: 0,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateTodoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTodoStatusInput) => todoService.updateStatus(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateTodoContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTodoContentInput) => todoService.updateContent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
