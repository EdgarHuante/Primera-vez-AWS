import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import './TodoForm.scss';

interface TodoFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError('El contenido no puede estar vacío');
      return;
    }
    if (trimmed.length > 500) {
      setError('El contenido no puede exceder 500 caracteres');
      return;
    }
    onSubmit(trimmed);
    setContent('');
    setError('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h3 className="todo-form__title">Nueva Tarea</h3>
      <Input
        label="Contenido"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError('');
        }}
        placeholder="Describe la tarea..."
        error={error}
        autoFocus
      />
      <div className="todo-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Crear
        </Button>
      </div>
    </form>
  );
};
