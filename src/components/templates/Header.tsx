import React from 'react';
import { useUIStore, FilterStatus } from '../../store/ui.store';
import { Button } from '../atoms/Button';
import './Header.scss';

interface HeaderProps {
  userName?: string;
  onSignOut: () => void;
  onAddTodo: () => void;
}

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'haciendo', label: 'Haciendo' },
  { value: 'hecho', label: 'Hechas' },
];

export const Header: React.FC<HeaderProps> = ({ userName, onSignOut, onAddTodo }) => {
  const { filter, setFilter } = useUIStore();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__top">
          <h1 className="header__title">Gestor de Tareas</h1>
          <div className="header__user">
            {userName && <span className="header__user-name">{userName}</span>}
            <Button variant="ghost" size="small" onClick={onSignOut}>
              Cerrar sesión
            </Button>
          </div>
        </div>
        <div className="header__actions">
          <nav className="header__filters">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`header__filter ${filter === option.value ? 'header__filter--active' : ''}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </nav>
          <Button variant="primary" onClick={onAddTodo}>
            + Nueva Tarea
          </Button>
        </div>
      </div>
    </header>
  );
};
