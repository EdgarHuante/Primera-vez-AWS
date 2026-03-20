import type { TaskResponse } from '@services/todo.service';
import { TodoItem } from '@components/molecules/TodoItem';
import type { TaskStatus } from '@domain/task';
import { ClipboardList } from 'lucide-react';
import './TodoList.scss';

interface TodoListProps {
  todos: TaskResponse[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onUpdateContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const SkeletonItem = () => (
  <li className="todo-skeleton">
    <div className="todo-skeleton__header">
      <div className="todo-skeleton__badge" />
      <div className="todo-skeleton__date" />
    </div>
    <div className="todo-skeleton__content">
      <div className="todo-skeleton__line" />
      <div className="todo-skeleton__line todo-skeleton__line--short" />
    </div>
    <div className="todo-skeleton__actions">
      <div className="todo-skeleton__button" />
      <div className="todo-skeleton__button" />
    </div>
  </li>
);

export const TodoList = ({
  todos,
  onStatusChange,
  onUpdateContent,
  onDelete,
  isLoading,
}: TodoListProps) => {
  if (isLoading) {
    return (
      <ul className="todo-list">
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </ul>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list__empty">
        <div className="todo-list__empty-icon">
          <ClipboardList size={64} strokeWidth={1} />
        </div>
        <h3 className="todo-list__empty-title">Sin tareas</h3>
        <p className="todo-list__empty-text">
          Comienza agregando tu primera tarea usando el botón de arriba
        </p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStatusChange={onStatusChange}
          onUpdateContent={onUpdateContent}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </ul>
  );
};
