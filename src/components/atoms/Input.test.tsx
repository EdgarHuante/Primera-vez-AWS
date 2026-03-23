import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  describe('renderizado básico', () => {
    it('renderiza un campo input', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renderiza el label si se provee', () => {
      render(<Input label="Descripción" />);
      expect(screen.getByText('Descripción')).toBeInTheDocument();
    });

    it('no renderiza label si no se provee', () => {
      render(<Input />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('asocia label con el input mediante htmlFor/id', () => {
      render(<Input label="Descripción" />);
      const label = screen.getByText('Descripción').closest('label');
      const input = screen.getByRole('textbox');
      expect(label?.htmlFor).toBe(input.id);
    });
  });

  describe('placeholder', () => {
    it('renderiza placeholder', () => {
      render(<Input placeholder="Escribe aquí..." />);
      expect(screen.getByPlaceholderText('Escribe aquí...')).toBeInTheDocument();
    });
  });

  describe('error', () => {
    it('muestra mensaje de error', () => {
      render(<Input error="Campo requerido" />);
      expect(screen.getByText('Campo requerido')).toBeInTheDocument();
    });

    it('aplica clase de error al wrapper', () => {
      const { container } = render(<Input error="Error" />);
      expect(container.firstChild).toHaveClass('input-wrapper--error');
    });

    it('no aplica clase de error sin error', () => {
      const { container } = render(<Input />);
      expect(container.firstChild).not.toHaveClass('input-wrapper--error');
    });

    it('input tiene aria-invalid cuando hay error', () => {
      render(<Input error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('input no tiene aria-invalid sin error', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('hint', () => {
    it('muestra mensaje de hint', () => {
      render(<Input hint="Escribe al menos 3 caracteres" />);
      expect(screen.getByText('Escribe al menos 3 caracteres')).toBeInTheDocument();
    });

    it('no muestra hint si hay error', () => {
      render(<Input hint="Sugerencia" error="Error" />);
      expect(screen.queryByText('Sugerencia')).not.toBeInTheDocument();
    });
  });

  describe('required', () => {
    it('muestra indicador de requerido cuando required es true', () => {
      render(<Input label="Nombre" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('no muestra indicador de requerido sin label', () => {
      render(<Input required />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('interacción', () => {
    it('llama onChange al escribir', async () => {
      const onChange = vi.fn();
      render(<Input onChange={onChange} />);
      await userEvent.type(screen.getByRole('textbox'), 'hola');
      expect(onChange).toHaveBeenCalled();
    });

    it('refleja el valor controlado', () => {
      render(<Input value="valor controlado" onChange={vi.fn()} />);
      expect(screen.getByRole('textbox')).toHaveValue('valor controlado');
    });
  });
});
