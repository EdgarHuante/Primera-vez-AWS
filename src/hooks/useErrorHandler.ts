import { useCallback } from 'react';
import { useToast } from './useToast';

interface ErrorContext {
  operation: string;
  [key: string]: unknown;
}

export function useErrorHandler() {
  const toast = useToast();

  const handleError = useCallback(
    (error: unknown, context?: ErrorContext) => {
      let message = 'Ha ocurrido un error inesperado';

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      if (context?.operation) {
        message = `Error al ${context.operation}: ${message}`;
      }

      console.error('Error:', error, context);
      toast.error(message);
    },
    [toast]
  );

  return { handleError };
}
