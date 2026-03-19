import React from 'react';
import type { Schema } from '../../../amplify/data/resource';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { STATUS_TRANSITIONS, STATUS_LABELS } from '../../types/todo';
import type { TodoStatus } from '../../types/todo';
import './TodoItem.scss';

type TodoItemProps = {
  todo: Schema['Todo']['type'];
  onStatusChange: (id: string, status: TodoStatus) => void;
  onDelete: (id: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onStatusChange, onDelete }) => {
  const currentStatus = todo.status as TodoStatus;
  const nextStatus = STATUS_TRANSITIONS[currentStatus];

  return (
    <li className={`todo-item todo-item--${currentStatus}`}>
      <div className="todo-item__header">
        <Badge status={currentStatus} />
      </div>
      <p className="todo-item__content">{todo.content}</p>
      <div className="todo-item__actions">
        {nextStatus && (
          <Button
            variant="success"
            size="small"
            onClick={() => onStatusChange(todo.id, nextStatus)}
          >
            {STATUS_LABELS[nextStatus]}
          </Button>
        )}
        <Button variant="danger" size="small" onClick={() => onDelete(todo.id)}>
          Eliminar
        </Button>
      </div>
    </li>
  );
};
