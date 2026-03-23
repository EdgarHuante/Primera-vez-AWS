import { useUIStore, type FilterStatus } from '@store/ui.store';
import { useThemeStore } from '@store/theme.store';
import { Button } from '@components/atoms/Button';
import { Sun, Moon, Plus, LogOut, ListFilter } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  userName?: string;
  onSignOut: () => void;
  onAddTodo: () => void;
  counts?: Record<FilterStatus, number>;
}

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'haciendo', label: 'En Progreso' },
  { value: 'hecho', label: 'Completadas' },
];

export const Header = ({ userName, onSignOut, onAddTodo, counts }: HeaderProps) => {
  const { filter, setFilter } = useUIStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__top">
          <div className="header__brand">
            <div className="header__logo">
              <ListFilter size={24} />
            </div>
            <h1 className="header__title">TaskFlow</h1>
          </div>
          <div className="header__user">
            {userName && (
              <span className="header__user-name">{userName}</span>
            )}
            <Button
              variant="ghost"
              size="small"
              onClick={toggleTheme}
              aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <Button variant="ghost" size="small" onClick={onSignOut}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>

        <div className="header__actions">
          <nav className="header__filters" role="tablist">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                role="tab"
                aria-selected={filter === option.value}
                className={`header__filter ${filter === option.value ? 'header__filter--active' : ''}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
                {counts && (
                  <span className="header__filter-count">
                    {option.value === 'all'
                      ? counts.pendiente + counts.haciendo + counts.hecho
                      : counts[option.value]}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <Button variant="primary" onClick={onAddTodo} leftIcon={<Plus size={18} />}>
            Nueva Tarea
          </Button>
        </div>
      </div>
    </header>
  );
};
