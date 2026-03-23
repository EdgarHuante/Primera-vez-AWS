import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import type { TaskResponse } from '@services/todo.service';

const mockHandlers = {
  onStatusChange: vi.fn(),
  onUpdateContent: vi.fn(),
  onDelete: vi.fn(),
};

const mockTodos: TaskResponse[] = [
  { id: '1', content: 'Primera tarea', status: 'pendiente' },
  { id: '2', content: 'Segunda tarea', status: 'haciendo' },
  { id: '3', content: 'Tercera tarea', status: 'hecho' },
];

describe('TodoList', () => {
  describe('estado de carga', () => {
    it('muestra skeletons cuando isLoading es true', () => {
      const { container } = render(
        <TodoList todos={[]} isLoading {...mockHandlers} />
      );
      expect(container.querySelectorAll('.todo-skeleton')).toHaveLength(3);
    });

    it('no muestra tareas durante la carga', () => {
      render(<TodoList todos={mockTodos} isLoading {...mockHandlers} />);
      expect(screen.queryByText('Primera tarea')).not.toBeInTheDocument();
    });
  });

  describe('estado vacío', () => {
    it('muestra mensaje "Sin tareas" cuando no hay tareas', () => {
      render(<TodoList todos={[]} {...mockHandlers} />);
      expect(screen.getByText('Sin tareas')).toBeInTheDocument();
    });

    it('muestra texto de ayuda para agregar tareas', () => {
      render(<TodoList todos={[]} {...mockHandlers} />);
      expect(
        screen.getByText(/Comienza agregando tu primera tarea/i)
      ).toBeInTheDocument();
    });

    it('no muestra skeletons cuando está vacío', () => {
      const { container } = render(<TodoList todos={[]} {...mockHandlers} />);
      expect(container.querySelectorAll('.todo-skeleton')).toHaveLength(0);
    });
  });

  describe('con tareas', () => {
    it('renderiza todas las tareas', () => {
      render(<TodoList todos={mockTodos} {...mockHandlers} />);
      expect(screen.getByText('Primera tarea')).toBeInTheDocument();
      expect(screen.getByText('Segunda tarea')).toBeInTheDocument();
      expect(screen.getByText('Tercera tarea')).toBeInTheDocument();
    });

    it('no muestra el estado vacío cuando hay tareas', () => {
      render(<TodoList todos={mockTodos} {...mockHandlers} />);
      expect(screen.queryByText('Sin tareas')).not.toBeInTheDocument();
    });

    it('renderiza una lista ul', () => {
      render(<TodoList todos={mockTodos} {...mockHandlers} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renderiza el número correcto de items', () => {
      render(<TodoList todos={mockTodos} {...mockHandlers} />);
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });
});
