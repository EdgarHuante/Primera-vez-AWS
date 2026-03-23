import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from './useErrorHandler';
import { useToastStore } from '@store/toast.store';

describe('useErrorHandler', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('maneja un Error con su mensaje', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.handleError(new Error('Error específico'));
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('error');
    expect(toasts[0].message).toBe('Error específico');
  });

  it('maneja un string de error', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.handleError('Error como string');
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].message).toBe('Error como string');
  });

  it('muestra mensaje genérico para error desconocido', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.handleError({ unexpected: true });
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].message).toBe('Ha ocurrido un error inesperado');
  });

  it('incluye contexto de operación en el mensaje', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.handleError(new Error('Fallo de red'), { operation: 'crear tarea' });
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].message).toBe('Error al crear tarea: Fallo de red');
  });

  it('sin contexto no agrega prefijo al mensaje', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.handleError(new Error('Sin contexto'));
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].message).toBe('Sin contexto');
  });

  it('llama a console.error con el error original', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');
    act(() => {
      result.current.handleError(error);
    });
    expect(console.error).toHaveBeenCalledWith('Error:', error, undefined);
  });

  it('llama a console.error con contexto si se pasa', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');
    const context = { operation: 'eliminar' };
    act(() => {
      result.current.handleError(error, context);
    });
    expect(console.error).toHaveBeenCalledWith('Error:', error, context);
  });
});
