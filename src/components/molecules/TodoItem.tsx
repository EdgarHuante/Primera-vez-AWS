import { useState } from 'react';
import type { TaskResponse } from '@services/todo.service';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { Trash2, ChevronRight, Check, X, Edit2 } from 'lucide-react';
import { STATUS_TRANSITIONS, STATUS_LABELS } from '@domain/task';
import type { TaskStatus } from '@domain/task';
import './TodoItem.scss';

interface TodoItemProps {
  todo: TaskResponse;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdateContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const TodoItem = ({ todo, onStatusChange, onUpdateContent, onDelete, index }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);
  
  const currentStatus = todo.status as TaskStatus;
  const nextStatus = STATUS_TRANSITIONS[currentStatus];

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== todo.content) {
      onUpdateContent(todo.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(todo.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li
      className={`todo-item todo-item--${currentStatus}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="todo-item__header">
        <Badge status={currentStatus} />
        {!isEditing && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => setIsEditing(true)}
            aria-label="Editar tarea"
          >
            <Edit2 size={14} />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="todo-item__edit">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="todo-item__edit-actions">
            <Button
              variant="success"
              size="small"
              onClick={handleSaveEdit}
            >
              <Check size={14} />
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleCancelEdit}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      ) : (
        <p className="todo-item__content">{todo.content}</p>
      )}
      
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
