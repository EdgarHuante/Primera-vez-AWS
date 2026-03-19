import type { TaskResponse } from '@services/todo.service';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { Trash2, ChevronRight } from 'lucide-react';
import { STATUS_TRANSITIONS, STATUS_LABELS } from '@domain/task';
import type { TaskStatus } from '@domain/task';
import './TodoItem.scss';

interface TodoItemProps {
  todo: TaskResponse;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const TodoItem = ({ todo, onStatusChange, onDelete, index }: TodoItemProps) => {
  const currentStatus = todo.status as TaskStatus;
  const nextStatus = STATUS_TRANSITIONS[currentStatus];

  return (
    <li
      className={`todo-item todo-item--${currentStatus}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
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
            rightIcon={<ChevronRight size={14} />}
          >
            {STATUS_LABELS[nextStatus]}
          </Button>
        )}
        <Button
          variant="ghost"
          size="small"
          onClick={() => onDelete(todo.id)}
          leftIcon={<Trash2 size={14} />}
        >
          Eliminar
        </Button>
      </div>
    </li>
  );
};
