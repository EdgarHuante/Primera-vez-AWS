import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Error de prueba');
  }
  return <div>Contenido normal</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sin errores', () => {
    it('renderiza children cuando no hay error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );
      expect(screen.getByText('Contenido normal')).toBeInTheDocument();
    });
  });

  describe('cuando ocurre un error', () => {
    it('muestra mensaje de error por defecto', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    });

    it('muestra el mensaje del error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByText('Error de prueba')).toBeInTheDocument();
    });

    it('muestra botón de "Intentar de nuevo"', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByRole('button', { name: /Intentar de nuevo/i })).toBeInTheDocument();
    });

    it('no renderiza los children cuando hay error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.queryByText('Contenido normal')).not.toBeInTheDocument();
    });
  });

  describe('fallback personalizado', () => {
    it('muestra el fallback personalizado si se provee', () => {
      render(
        <ErrorBoundary fallback={<div>Error personalizado</div>}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByText('Error personalizado')).toBeInTheDocument();
    });

    it('no muestra el mensaje por defecto cuando hay fallback', () => {
      render(
        <ErrorBoundary fallback={<div>Error personalizado</div>}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.queryByText('Algo salió mal')).not.toBeInTheDocument();
    });
  });

  describe('reset', () => {
    it('oculta el error al hacer clic en "Intentar de nuevo"', async () => {
      // Wrapper controlado: el padre decide si el hijo lanza o no
      let setShouldThrow: (v: boolean) => void;
      const ControlledWrapper = () => {
        const [shouldThrow, setThrow] = React.useState(true);
        setShouldThrow = setThrow;
        return (
          <ErrorBoundary>
            <ThrowError shouldThrow={shouldThrow} />
          </ErrorBoundary>
        );
      };

      render(<ControlledWrapper />);
      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

      // Primero le decimos que ya no lance error, luego reseteamos
      act(() => setShouldThrow!(false));
      await userEvent.click(screen.getByRole('button', { name: /Intentar de nuevo/i }));

      expect(screen.getByText('Contenido normal')).toBeInTheDocument();
    });
  });
});
