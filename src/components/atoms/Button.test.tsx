import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  describe('renderizado básico', () => {
    it('renderiza el texto del botón', () => {
      render(<Button>Aceptar</Button>);
      expect(screen.getByRole('button', { name: 'Aceptar' })).toBeInTheDocument();
    });

    it('aplica variante primary por defecto', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--primary');
    });

    it('aplica tamaño medium por defecto', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--medium');
    });

    it('siempre tiene clase base "button"', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('button');
    });
  });

  describe('variantes', () => {
    const variantes = ['primary', 'secondary', 'success', 'danger', 'ghost'] as const;
    variantes.forEach((variant) => {
      it(`aplica clase button--${variant}`, () => {
        render(<Button variant={variant}>Test</Button>);
        expect(screen.getByRole('button')).toHaveClass(`button--${variant}`);
      });
    });
  });

  describe('tamaños', () => {
    const tamaños = ['small', 'medium', 'large'] as const;
    tamaños.forEach((size) => {
      it(`aplica clase button--${size}`, () => {
        render(<Button size={size}>Test</Button>);
        expect(screen.getByRole('button')).toHaveClass(`button--${size}`);
      });
    });
  });

  describe('isLoading', () => {
    it('deshabilita el botón cuando isLoading es true', () => {
      render(<Button isLoading>Guardar</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('aplica clase button--loading', () => {
      render(<Button isLoading>Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--loading');
    });

    it('no muestra texto del children durante loading', () => {
      render(<Button isLoading>Guardar</Button>);
      expect(screen.queryByText('Guardar')).not.toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('deshabilita el botón cuando disabled es true', () => {
      render(<Button disabled>Test</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('iconos', () => {
    it('renderiza leftIcon', () => {
      render(<Button leftIcon={<span data-testid="left-icon" />}>Test</Button>);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renderiza rightIcon', () => {
      render(<Button rightIcon={<span data-testid="right-icon" />}>Test</Button>);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('no renderiza iconos durante loading', () => {
      render(
        <Button isLoading leftIcon={<span data-testid="left-icon" />}>
          Test
        </Button>
      );
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    });
  });

  describe('interacción', () => {
    it('llama onClick al hacer clic', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Clic</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('no llama onClick cuando está deshabilitado', async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Clic
        </Button>
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('no llama onClick cuando isLoading', async () => {
      const onClick = vi.fn();
      render(
        <Button isLoading onClick={onClick}>
          Clic
        </Button>
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('className adicional', () => {
    it('permite agregar clases personalizadas', () => {
      render(<Button className="custom-class">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });
});
