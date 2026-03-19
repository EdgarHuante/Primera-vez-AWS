import React from 'react';
import type { Schema } from '../../../amplify/data/resource';
import { TodoItem } from '../molecules/TodoItem';
import type { TodoStatus } from '../../types/todo';
import './TodoList.scss';

interface TodoListProps {
  todos: Schema['Todo']['type'][];
  onStatusChange: (id: string, status: TodoStatus) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onStatusChange,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="todo-list__loading">
        <div className="todo-list__spinner" />
        <span>Cargando tareas...</span>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list__empty">
        <span className="todo-list__empty-icon">📝</span>
        <p>No hay tareas. ¡Crea una nueva!</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
