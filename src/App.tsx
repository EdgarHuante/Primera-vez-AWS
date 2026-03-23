import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Header } from '@components/templates/Header';
import { TodoList } from '@components/organisms/TodoList';
import { Modal } from '@components/organisms/Modal';
import { TodoForm } from '@components/molecules/TodoForm';
import { useUIStore } from '@store/ui.store';
import { useTodos, useCreateTodo, useUpdateTodoStatus, useUpdateTodoContent, useDeleteTodo } from '@hooks/useTodos';
import { useToast } from '@hooks/useToast';
import { useErrorHandler } from '@hooks/useErrorHandler';
import type { TaskStatus } from '@domain/task';
import type { FilterStatus } from '@store/ui.store';
import { Sparkles } from 'lucide-react';
import '@styles/App.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { user, signOut } = useAuthenticator();
  const { isModalOpen, openModal, closeModal, filter } = useUIStore();
  const toast = useToast();
  const { handleError } = useErrorHandler();

  const { data: todos = [], isLoading } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodoStatus = useUpdateTodoStatus();
  const updateTodoContent = useUpdateTodoContent();
  const deleteTodo = useDeleteTodo();

  const counts: Record<FilterStatus, number> = {
    all: todos.length,
    pendiente: todos.filter((t) => t.status === 'pendiente').length,
    haciendo: todos.filter((t) => t.status === 'haciendo').length,
    hecho: todos.filter((t) => t.status === 'hecho').length,
  };

  const filteredTodos = filter === 'all'
    ? todos
    : todos.filter((todo) => todo.status === filter);

  const handleCreateTodo = (content: string) => {
    createTodo.mutate(
      { content },
      {
        onSuccess: () => {
          toast.success('Tarea creada exitosamente');
          closeModal();
        },
        onError: (error) => handleError(error, { operation: 'crear tarea' }),
      }
    );
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateTodoStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success('Estado actualizado correctamente'),
        onError: (error) => handleError(error, { operation: 'actualizar estado' }),
      }
    );
  };

  const handleUpdateContent = (id: string, content: string) => {
    updateTodoContent.mutate(
      { id, content },
      {
        onSuccess: () => toast.success('Tarea actualizada correctamente'),
        onError: (error) => handleError(error, { operation: 'actualizar tarea' }),
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      deleteTodo.mutate(id, {
        onSuccess: () => toast.success('Tarea eliminada'),
        onError: (error) => handleError(error, { operation: 'eliminar tarea' }),
      });
    }
  };

  return (
    <div className="app">
      <Header
        userName={user?.signInDetails?.loginId}
        onSignOut={signOut}
        onAddTodo={openModal}
        counts={counts}
      />
      <main className="app__main">
        <TodoList
          todos={filteredTodos}
          onStatusChange={handleStatusChange}
          onUpdateContent={handleUpdateContent}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </main>
      <footer className="app__footer">
        <div className="app__footer-content">
          <span className="app__footer-brand">
            <Sparkles size={14} />
            TaskFlow v1.0.0
          </span>
          <span className="app__footer-divider">•</span>
          <span>{new Date().getFullYear()} - Powered by AWS Amplify</span>
        </div>
      </footer>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <TodoForm
          onSubmit={handleCreateTodo}
          onCancel={closeModal}
          isLoading={createTodo.isPending}
        />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
