import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renderiza "Pendiente" para status pendiente', () => {
    render(<Badge status="pendiente" />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('renderiza "En Progreso" para status haciendo', () => {
    render(<Badge status="haciendo" />);
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
  });

  it('renderiza "Completado" para status hecho', () => {
    render(<Badge status="hecho" />);
    expect(screen.getByText('Completado')).toBeInTheDocument();
  });

  it('aplica clase badge--pendiente', () => {
    const { container } = render(<Badge status="pendiente" />);
    expect(container.firstChild).toHaveClass('badge--pendiente');
  });

  it('aplica clase badge--haciendo', () => {
    const { container } = render(<Badge status="haciendo" />);
    expect(container.firstChild).toHaveClass('badge--haciendo');
  });

  it('aplica clase badge--hecho', () => {
    const { container } = render(<Badge status="hecho" />);
    expect(container.firstChild).toHaveClass('badge--hecho');
  });

  it('siempre tiene la clase base badge', () => {
    const { container } = render(<Badge status="pendiente" />);
    expect(container.firstChild).toHaveClass('badge');
  });
});
