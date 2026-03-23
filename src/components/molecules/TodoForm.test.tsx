import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('renderizado', () => {
    it('muestra el título "Nueva Tarea"', () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByText('Nueva Tarea')).toBeInTheDocument();
    });

    it('muestra el campo de descripción', () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    });

    it('muestra botón de crear', () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByRole('button', { name: /Crear Tarea/i })).toBeInTheDocument();
    });

    it('muestra botón de cancelar', () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    });

    it('deshabilita el botón de submit cuando isLoading es true', () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading />);
      // Cuando isLoading=true, el Button muestra spinner en lugar del texto
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find((b) => b.classList.contains('button--loading'));
      expect(submitButton).toBeDisabled();
    });
  });

  describe('submit', () => {
    it('llama onSubmit con el contenido al enviar el formulario', async () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      await userEvent.type(screen.getByLabelText(/Descripción/i), 'Mi nueva tarea');
      await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
      expect(mockOnSubmit).toHaveBeenCalledWith('Mi nueva tarea');
    });

    it('limpia el campo después de enviar', async () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const input = screen.getByLabelText(/Descripción/i);
      await userEvent.type(input, 'Tarea');
      await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
      expect(input).toHaveValue('');
    });

    it('no llama onSubmit si el contenido está vacío', async () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('no llama onSubmit si el contenido es solo espacios', async () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      await userEvent.type(screen.getByLabelText(/Descripción/i), '   ');
      await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('envía el contenido sin espacios iniciales/finales', async () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      await userEvent.type(screen.getByLabelText(/Descripción/i), '  Tarea con espacios  ');
      await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));
      expect(mockOnSubmit).toHaveBeenCalledWith('Tarea con espacios');
    });

    it('envía el formulario al presionar Enter', async () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const input = screen.getByLabelText(/Descripción/i);
      await userEvent.type(input, 'Tarea por Enter{Enter}');
      expect(mockOnSubmit).toHaveBeenCalledWith('Tarea por Enter');
    });
  });

  describe('cancelar', () => {
    it('llama onCancel al hacer clic en Cancelar', async () => {
      render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      await userEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});
