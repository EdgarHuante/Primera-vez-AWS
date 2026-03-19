import { useCallback } from 'react';

interface UseConfirmDeleteOptions {
  title?: string;
  message?: string;
}

interface UseConfirmDeleteReturn {
  confirm: (onConfirm: () => void) => void;
}

export function useConfirmDelete(options: UseConfirmDeleteOptions = {}): UseConfirmDeleteReturn {
  const {
    title = 'Confirmar eliminación',
    message = '¿Estás seguro de que deseas eliminar este elemento?',
  } = options;

  const confirm = useCallback((onConfirm: () => void) => {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
  }, [title, message]);

  return { confirm };
}
