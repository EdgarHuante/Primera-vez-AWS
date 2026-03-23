import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks hoisted para poder referenciarlos en vi.mock
const mockTodoModel = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {
      Todo: mockTodoModel,
    },
  })),
}));

import { todoService } from './todo.service';

const mockTodo = {
  id: 'todo-1',
  content: 'Tarea de prueba',
  status: 'pendiente' as const,
};

describe('todoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('retorna lista de tareas mapeada correctamente', async () => {
      mockTodoModel.list.mockResolvedValue({
        data: [mockTodo, { id: 'todo-2', content: 'Otra tarea', status: 'haciendo' }],
      });

      const result = await todoService.getAll();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'todo-1', content: 'Tarea de prueba', status: 'pendiente' });
      expect(result[1]).toEqual({ id: 'todo-2', content: 'Otra tarea', status: 'haciendo' });
    });

    it('retorna lista vacía si no hay tareas', async () => {
      mockTodoModel.list.mockResolvedValue({ data: [] });
      const result = await todoService.getAll();
      expect(result).toEqual([]);
    });

    it('usa "pendiente" como status por defecto si status es null', async () => {
      mockTodoModel.list.mockResolvedValue({
        data: [{ id: 'todo-1', content: 'Tarea', status: null }],
      });
      const result = await todoService.getAll();
      expect(result[0].status).toBe('pendiente');
    });

    it('usa string vacío como content por defecto si content es null', async () => {
      mockTodoModel.list.mockResolvedValue({
        data: [{ id: 'todo-1', content: null, status: 'pendiente' }],
      });
      const result = await todoService.getAll();
      expect(result[0].content).toBe('');
    });
  });

  describe('create', () => {
    it('crea una tarea correctamente con input válido', async () => {
      mockTodoModel.create.mockResolvedValue({ data: mockTodo });

      const result = await todoService.create({ content: 'Tarea de prueba' });
      expect(result).toEqual({ id: 'todo-1', content: 'Tarea de prueba', status: 'pendiente' });
      expect(mockTodoModel.create).toHaveBeenCalledWith({
        content: 'Tarea de prueba',
        status: 'pendiente',
      });
    });

    it('lanza error si contenido está vacío', async () => {
      await expect(todoService.create({ content: '' })).rejects.toThrow(
        'El contenido no puede estar vacío'
      );
      expect(mockTodoModel.create).not.toHaveBeenCalled();
    });

    it('lanza error si contenido excede 500 caracteres', async () => {
      await expect(todoService.create({ content: 'a'.repeat(501) })).rejects.toThrow(
        'El contenido no puede exceder 500 caracteres'
      );
    });

    it('lanza error si la API no retorna data', async () => {
      mockTodoModel.create.mockResolvedValue({ data: null });
      await expect(todoService.create({ content: 'Test' })).rejects.toThrow(
        'Failed to create todo'
      );
    });

    it('lanza error si la API falla', async () => {
      mockTodoModel.create.mockRejectedValue(new Error('Network error'));
      await expect(todoService.create({ content: 'Test' })).rejects.toThrow('Network error');
    });
  });

  describe('updateStatus', () => {
    it('actualiza el status correctamente', async () => {
      mockTodoModel.update.mockResolvedValue({
        data: { ...mockTodo, status: 'haciendo' },
      });

      const result = await todoService.updateStatus({ id: 'todo-1', status: 'haciendo' });
      expect(result.status).toBe('haciendo');
      expect(mockTodoModel.update).toHaveBeenCalledWith({ id: 'todo-1', status: 'haciendo' });
    });

    it('lanza error con id vacío', async () => {
      await expect(todoService.updateStatus({ id: '', status: 'haciendo' })).rejects.toThrow();
      expect(mockTodoModel.update).not.toHaveBeenCalled();
    });

    it('lanza error con status inválido', async () => {
      await expect(
        todoService.updateStatus({ id: 'todo-1', status: 'invalido' as never })
      ).rejects.toThrow();
    });

    it('lanza error si la API no retorna data', async () => {
      mockTodoModel.update.mockResolvedValue({ data: null });
      await expect(
        todoService.updateStatus({ id: 'todo-1', status: 'haciendo' })
      ).rejects.toThrow('Failed to update todo');
    });
  });

  describe('updateContent', () => {
    it('actualiza el contenido correctamente', async () => {
      mockTodoModel.update.mockResolvedValue({
        data: { ...mockTodo, content: 'Contenido actualizado' },
      });

      const result = await todoService.updateContent({
        id: 'todo-1',
        content: 'Contenido actualizado',
      });
      expect(result.content).toBe('Contenido actualizado');
      expect(mockTodoModel.update).toHaveBeenCalledWith({
        id: 'todo-1',
        content: 'Contenido actualizado',
      });
    });

    it('lanza error con contenido vacío', async () => {
      await expect(
        todoService.updateContent({ id: 'todo-1', content: '' })
      ).rejects.toThrow('El contenido no puede estar vacío');
    });

    it('lanza error si la API no retorna data', async () => {
      mockTodoModel.update.mockResolvedValue({ data: null });
      await expect(
        todoService.updateContent({ id: 'todo-1', content: 'Test' })
      ).rejects.toThrow('Failed to update todo');
    });
  });

  describe('delete', () => {
    it('elimina una tarea correctamente', async () => {
      mockTodoModel.delete.mockResolvedValue({});
      await expect(todoService.delete('todo-1')).resolves.toBeUndefined();
      expect(mockTodoModel.delete).toHaveBeenCalledWith({ id: 'todo-1' });
    });

    it('lanza error con id vacío', async () => {
      await expect(todoService.delete('')).rejects.toThrow();
      expect(mockTodoModel.delete).not.toHaveBeenCalled();
    });

    it('propaga errores de la API', async () => {
      mockTodoModel.delete.mockRejectedValue(new Error('Delete failed'));
      await expect(todoService.delete('todo-1')).rejects.toThrow('Delete failed');
    });
  });
});
