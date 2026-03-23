import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from './useToast';
import { useToastStore } from '@store/toast.store';

describe('useToast', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('success agrega un toast de tipo success', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.success('Operación exitosa');
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Operación exitosa');
  });

  it('error agrega un toast de tipo error', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.error('Algo salió mal');
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].type).toBe('error');
    expect(toasts[0].message).toBe('Algo salió mal');
  });

  it('info agrega un toast de tipo info', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.info('Información');
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].type).toBe('info');
  });

  it('warning agrega un toast de tipo warning', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.warning('Advertencia');
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].type).toBe('warning');
  });

  it('showToast acepta tipo y mensaje', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.showToast('success', 'Via showToast');
    });
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].message).toBe('Via showToast');
  });

  it('success con duración personalizada', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.success('Temporal', 1000);
    });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('removeToast elimina un toast específico', () => {
    const { result } = renderHook(() => useToast());
    let toastId: string;
    act(() => {
      toastId = useToastStore.getState().addToast({ type: 'info', message: 'test', duration: 0 });
    });
    act(() => {
      result.current.removeToast(toastId!);
    });
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('clearAll elimina todos los toasts', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.success('A', 0);
      result.current.error('B', 0);
    });
    act(() => {
      result.current.clearAll();
    });
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
