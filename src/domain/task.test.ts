import { describe, it, expect } from 'vitest';
import { STATUS_TRANSITIONS, STATUS_LABELS } from './task';
import type { TaskStatus } from './task';

describe('STATUS_TRANSITIONS', () => {
  it('pendiente transiciones a haciendo', () => {
    expect(STATUS_TRANSITIONS['pendiente']).toBe('haciendo');
  });

  it('haciendo transiciona a hecho', () => {
    expect(STATUS_TRANSITIONS['haciendo']).toBe('hecho');
  });

  it('hecho no tiene siguiente estado (null)', () => {
    expect(STATUS_TRANSITIONS['hecho']).toBeNull();
  });

  it('cubre todos los estados posibles', () => {
    const estados: TaskStatus[] = ['pendiente', 'haciendo', 'hecho'];
    estados.forEach((estado) => {
      expect(STATUS_TRANSITIONS).toHaveProperty(estado);
    });
  });
});

describe('STATUS_LABELS', () => {
  it('pendiente tiene label "Pendiente"', () => {
    expect(STATUS_LABELS['pendiente']).toBe('Pendiente');
  });

  it('haciendo tiene label "Haciendo"', () => {
    expect(STATUS_LABELS['haciendo']).toBe('Haciendo');
  });

  it('hecho tiene label "Hecho"', () => {
    expect(STATUS_LABELS['hecho']).toBe('Hecho');
  });

  it('todos los estados tienen labels definidos', () => {
    const estados: TaskStatus[] = ['pendiente', 'haciendo', 'hecho'];
    estados.forEach((estado) => {
      expect(STATUS_LABELS[estado]).toBeTruthy();
      expect(typeof STATUS_LABELS[estado]).toBe('string');
    });
  });
});
