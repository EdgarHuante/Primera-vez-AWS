import type { TaskResponse } from '@services/todo.service';
import { TodoItem } from '@components/molecules/TodoItem';
import type { TaskStatus } from '@domain/task';
import './TodoList.scss';

interface TodoListProps {
  todos: TaskResponse[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const TodoList = ({
  todos,
  onStatusChange,
  onDelete,
  isLoading,
}: TodoListProps) => {
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
