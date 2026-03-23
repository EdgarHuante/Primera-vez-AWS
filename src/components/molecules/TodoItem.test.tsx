import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import type { TaskResponse } from '@services/todo.service';

const mockTodo: TaskResponse = {
  id: 'todo-1',
  content: 'Tarea de ejemplo',
  status: 'pendiente',
};

const defaultProps = {
  todo: mockTodo,
  onStatusChange: vi.fn(),
  onUpdateContent: vi.fn(),
  onDelete: vi.fn(),
  index: 0,
};

describe('TodoItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('renderizado inicial', () => {
    it('muestra el contenido de la tarea', () => {
      render(<TodoItem {...defaultProps} />);
      expect(screen.getByText('Tarea de ejemplo')).toBeInTheDocument();
    });

    it('muestra el badge con el estado', () => {
      render(<TodoItem {...defaultProps} />);
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    it('aplica clase según el estado de la tarea', () => {
      const { container } = render(<TodoItem {...defaultProps} />);
      expect(container.firstChild).toHaveClass('todo-item--pendiente');
    });

    it('muestra botón de avance de estado para pendiente', () => {
      render(<TodoItem {...defaultProps} />);
      expect(screen.getByText('Haciendo')).toBeInTheDocument();
    });

    it('muestra botón de avance para haciendo', () => {
      render(<TodoItem {...defaultProps} todo={{ ...mockTodo, status: 'haciendo' }} />);
      expect(screen.getByText('Hecho')).toBeInTheDocument();
    });

    it('no muestra botón de avance para hecho (estado final)', () => {
      render(<TodoItem {...defaultProps} todo={{ ...mockTodo, status: 'hecho' }} />);
      expect(screen.queryByText('Hecho')).not.toBeInTheDocument();
    });

    it('muestra botón de eliminar', () => {
      render(<TodoItem {...defaultProps} />);
      expect(screen.getByText('Eliminar')).toBeInTheDocument();
    });

    it('muestra botón de editar', () => {
      render(<TodoItem {...defaultProps} />);
      expect(screen.getByRole('button', { name: /Editar tarea/i })).toBeInTheDocument();
    });
  });

  describe('cambio de estado', () => {
    it('llama onStatusChange al avanzar estado de pendiente a haciendo', async () => {
      render(<TodoItem {...defaultProps} />);
      await userEvent.click(screen.getByText('Haciendo'));
      expect(defaultProps.onStatusChange).toHaveBeenCalledWith('todo-1', 'haciendo');
    });

    it('llama onStatusChange al avanzar de haciendo a hecho', async () => {
      render(<TodoItem {...defaultProps} todo={{ ...mockTodo, status: 'haciendo' }} />);
      await userEvent.click(screen.getByText('Hecho'));
      expect(defaultProps.onStatusChange).toHaveBeenCalledWith('todo-1', 'hecho');
    });
  });

  describe('eliminar', () => {
    it('llama onDelete con el id al hacer clic en Eliminar', async () => {
      render(<TodoItem {...defaultProps} />);
      await userEvent.click(screen.getByText('Eliminar'));
      expect(defaultProps.onDelete).toHaveBeenCalledWith('todo-1');
    });
  });

  describe('modo edición', () => {
    it('entra en modo edición al hacer clic en editar', async () => {
      render(<TodoItem {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: /Editar tarea/i }));
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.queryByText('Tarea de ejemplo')).not.toBeInTheDocument();
    });

    it('muestra el contenido actual en el input de edición', async () => {
      render(<TodoItem {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: /Editar tarea/i }));
      expect(screen.getByRole('textbox')).toHaveValue('Tarea de ejemplo');
    });

    it('guarda el nuevo contenido al hacer clic en guardar', async () => {
      render(<TodoItem {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: /Editar tarea/i }));
      const input = screen.getByRole('textbox');
      await userEvent.clear(input);
      await userEvent.type(input, 'Contenido actualizado');
      // Clic en botón de confirmar (Check)
      const saveButton = screen.getAllByRole('button').find((b) =>
        b.querySelector('svg')
      );
      // Buscamos el botón de success (Check)
      const buttons = screen.getAllByRole('button');
      const checkButton = buttons.find((b) => b.className.includes('success'));
      await userEvent.click(checkButton!);
      expect(defaultProps.onUpdateContent).toHaveBeenCalledWith('todo-1', 'Contenido actualizado');
    });

    it('cancela la edición al presionar Escape', async () => {
      render(<TodoItem {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: /Editar tarea/i }));
      const input = screen.getByRole('textbox');
      await userEvent.type(input, ' modificado');
      await userEvent.keyboard('{Escape}');
      expect(screen.getByText('Tarea de ejemplo')).toBeInTheDocument();
      expect(defaultProps.onUpdateContent).not.toHaveBeenCalled();
    });

    it('guarda al presionar Enter', async () => {
      render(<TodoItem {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: /Editar tarea/i }));
      const input = screen.getByRole('textbox');
      await userEvent.clear(input);
      await userEvent.type(input, 'Nuevo contenido por Enter{Enter}');
      expect(defaultProps.onUpdateContent).toHaveBeenCalledWith('todo-1', 'Nuevo contenido por Enter');
    });

    it('no llama onUpdateContent si el contenido no cambió', async () => {
      render(<TodoItem {...defaultProps} />);
      await userEvent.click(screen.getByRole('button', { name: /Editar tarea/i }));
      const buttons = screen.getAllByRole('button');
      const checkButton = buttons.find((b) => b.className.includes('success'));
      await userEvent.click(checkButton!);
      expect(defaultProps.onUpdateContent).not.toHaveBeenCalled();
    });
  });
});
