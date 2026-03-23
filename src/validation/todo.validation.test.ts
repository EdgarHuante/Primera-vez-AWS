import { describe, it, expect } from 'vitest';
import { safeParse } from 'valibot';
import {
  CreateTodoSchema,
  UpdateTodoStatusSchema,
  UpdateTodoContentSchema,
  DeleteTodoSchema,
} from './todo.validation';

describe('CreateTodoSchema', () => {
  it('acepta contenido válido', () => {
    const result = safeParse(CreateTodoSchema, { content: 'Tarea válida' });
    expect(result.success).toBe(true);
  });

  it('acepta contenido de 1 caracter', () => {
    const result = safeParse(CreateTodoSchema, { content: 'a' });
    expect(result.success).toBe(true);
  });

  it('acepta contenido de exactamente 500 caracteres', () => {
    const result = safeParse(CreateTodoSchema, { content: 'a'.repeat(500) });
    expect(result.success).toBe(true);
  });

  it('rechaza contenido vacío', () => {
    const result = safeParse(CreateTodoSchema, { content: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0].message).toBe('El contenido no puede estar vacío');
    }
  });

  it('rechaza contenido con más de 500 caracteres', () => {
    const result = safeParse(CreateTodoSchema, { content: 'a'.repeat(501) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0].message).toBe('El contenido no puede exceder 500 caracteres');
    }
  });

  it('rechaza cuando content no es string', () => {
    const result = safeParse(CreateTodoSchema, { content: 123 });
    expect(result.success).toBe(false);
  });

  it('rechaza objeto sin campo content', () => {
    const result = safeParse(CreateTodoSchema, {});
    expect(result.success).toBe(false);
  });
});

describe('UpdateTodoStatusSchema', () => {
  it('acepta id y status válidos - pendiente', () => {
    const result = safeParse(UpdateTodoStatusSchema, { id: 'abc-123', status: 'pendiente' });
    expect(result.success).toBe(true);
  });

  it('acepta status haciendo', () => {
    const result = safeParse(UpdateTodoStatusSchema, { id: 'abc-123', status: 'haciendo' });
    expect(result.success).toBe(true);
  });

  it('acepta status hecho', () => {
    const result = safeParse(UpdateTodoStatusSchema, { id: 'abc-123', status: 'hecho' });
    expect(result.success).toBe(true);
  });

  it('rechaza id vacío', () => {
    const result = safeParse(UpdateTodoStatusSchema, { id: '', status: 'pendiente' });
    expect(result.success).toBe(false);
  });

  it('rechaza status inválido', () => {
    const result = safeParse(UpdateTodoStatusSchema, { id: 'abc-123', status: 'invalido' });
    expect(result.success).toBe(false);
  });

  it('rechaza sin campos', () => {
    const result = safeParse(UpdateTodoStatusSchema, {});
    expect(result.success).toBe(false);
  });
});

describe('UpdateTodoContentSchema', () => {
  it('acepta id y contenido válidos', () => {
    const result = safeParse(UpdateTodoContentSchema, {
      id: 'abc-123',
      content: 'Nuevo contenido',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza contenido vacío', () => {
    const result = safeParse(UpdateTodoContentSchema, { id: 'abc-123', content: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0].message).toBe('El contenido no puede estar vacío');
    }
  });

  it('rechaza contenido mayor a 500 caracteres', () => {
    const result = safeParse(UpdateTodoContentSchema, {
      id: 'abc-123',
      content: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('rechaza id vacío', () => {
    const result = safeParse(UpdateTodoContentSchema, { id: '', content: 'Contenido' });
    expect(result.success).toBe(false);
  });
});

describe('DeleteTodoSchema', () => {
  it('acepta id válido', () => {
    const result = safeParse(DeleteTodoSchema, { id: 'abc-123' });
    expect(result.success).toBe(true);
  });

  it('rechaza id vacío', () => {
    const result = safeParse(DeleteTodoSchema, { id: '' });
    expect(result.success).toBe(false);
  });

  it('rechaza sin campo id', () => {
    const result = safeParse(DeleteTodoSchema, {});
    expect(result.success).toBe(false);
  });
});
