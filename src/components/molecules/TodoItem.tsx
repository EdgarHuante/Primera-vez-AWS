import type { TaskResponse } from '@services/todo.service';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { STATUS_TRANSITIONS, STATUS_LABELS } from '@domain/task';
import type { TaskStatus } from '@domain/task';
import './TodoItem.scss';

interface TodoItemProps {
  todo: TaskResponse;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onStatusChange, onDelete }: TodoItemProps) => {
  const currentStatus = todo.status as TaskStatus;
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
