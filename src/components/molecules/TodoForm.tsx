import { useState, type FormEvent } from 'react';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { ClipboardList } from 'lucide-react';
import './TodoForm.scss';

interface TodoFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TodoForm = ({ onSubmit, onCancel, isLoading }: TodoFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__header">
        <ClipboardList size={24} className="todo-form__icon" />
        <h3 className="todo-form__title">Nueva Tarea</h3>
      </div>
      <Input
        label="Descripción"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Describe la tarea que necesitas completar..."
        autoFocus
        required
        hint="Describe claramente qué necesitas hacer"
      />
      <div className="todo-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Crear Tarea
        </Button>
      </div>
    </form>
  );
};
