import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useToastStore } from './toast.store';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('addToast', () => {
    it('agrega un toast y retorna un id', () => {
      const id = useToastStore.getState().addToast({ type: 'success', message: 'OK' });
      expect(id).toMatch(/^toast-\d+$/);
      expect(useToastStore.getState().toasts).toHaveLength(1);
    });

    it('agrega múltiples toasts', () => {
      useToastStore.getState().addToast({ type: 'success', message: 'Uno' });
      useToastStore.getState().addToast({ type: 'error', message: 'Dos' });
      expect(useToastStore.getState().toasts).toHaveLength(2);
    });

    it('el toast tiene los campos correctos', () => {
      const id = useToastStore.getState().addToast({
        type: 'info',
        message: 'Mensaje de prueba',
        duration: 3000,
      });
      const toast = useToastStore.getState().toasts.find((t) => t.id === id);
      expect(toast).toBeDefined();
      expect(toast?.type).toBe('info');
      expect(toast?.message).toBe('Mensaje de prueba');
    });

    it('el toast incluye action si se pasa', () => {
      const onClick = vi.fn();
      const id = useToastStore.getState().addToast({
        type: 'warning',
        message: 'Con acción',
        action: { label: 'Deshacer', onClick },
      });
      const toast = useToastStore.getState().toasts.find((t) => t.id === id);
      expect(toast?.action?.label).toBe('Deshacer');
      expect(toast?.action?.onClick).toBe(onClick);
    });

    it('se elimina automáticamente después de la duración por defecto (4000ms)', () => {
      const id = useToastStore.getState().addToast({ type: 'success', message: 'Auto-remove' });
      expect(useToastStore.getState().toasts).toHaveLength(1);
      vi.advanceTimersByTime(4000);
      expect(useToastStore.getState().toasts.find((t) => t.id === id)).toBeUndefined();
    });

    it('se elimina automáticamente según duración personalizada', () => {
      const id = useToastStore.getState().addToast({
        type: 'success',
        message: 'Temporal',
        duration: 2000,
      });
      vi.advanceTimersByTime(1999);
      expect(useToastStore.getState().toasts.find((t) => t.id === id)).toBeDefined();
      vi.advanceTimersByTime(1);
      expect(useToastStore.getState().toasts.find((t) => t.id === id)).toBeUndefined();
    });

    it('no se elimina si duration es 0', () => {
      const id = useToastStore.getState().addToast({
        type: 'info',
        message: 'Permanente',
        duration: 0,
      });
      vi.advanceTimersByTime(10000);
      expect(useToastStore.getState().toasts.find((t) => t.id === id)).toBeDefined();
    });
  });

  describe('removeToast', () => {
    it('elimina un toast por id', () => {
      const id = useToastStore.getState().addToast({ type: 'success', message: 'Borrar' });
      useToastStore.getState().removeToast(id);
      expect(useToastStore.getState().toasts.find((t) => t.id === id)).toBeUndefined();
    });

    it('no falla si el id no existe', () => {
      expect(() => useToastStore.getState().removeToast('id-inexistente')).not.toThrow();
    });

    it('solo elimina el toast especificado', () => {
      const id1 = useToastStore.getState().addToast({ type: 'success', message: 'Uno' });
      const id2 = useToastStore.getState().addToast({ type: 'error', message: 'Dos' });
      useToastStore.getState().removeToast(id1);
      expect(useToastStore.getState().toasts).toHaveLength(1);
      expect(useToastStore.getState().toasts[0].id).toBe(id2);
    });
  });

  describe('clearAll', () => {
    it('elimina todos los toasts', () => {
      useToastStore.getState().addToast({ type: 'success', message: 'A' });
      useToastStore.getState().addToast({ type: 'error', message: 'B' });
      useToastStore.getState().clearAll();
      expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it('no falla si no hay toasts', () => {
      expect(() => useToastStore.getState().clearAll()).not.toThrow();
    });
  });
});
