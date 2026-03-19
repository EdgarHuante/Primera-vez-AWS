import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Header } from './components/templates/Header';
import { TodoList } from './components/organisms/TodoList';
import { Modal } from './components/organisms/Modal';
import { TodoForm } from './components/molecules/TodoForm';
import { useUIStore } from './store/ui.store';
import { useTodos, useCreateTodo, useUpdateTodoStatus, useDeleteTodo } from './components/organisms/useTodos';
import type { TodoStatus } from './types/todo';
import './styles/App.scss';

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
  
  const { data: todos = [], isLoading } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodoStatus = useUpdateTodoStatus();
  const deleteTodo = useDeleteTodo();

  const filteredTodos = filter === 'all' 
    ? todos 
    : todos.filter((todo) => todo.status === filter);

  const handleCreateTodo = (content: string) => {
    createTodo.mutate({ content });
  };

  const handleStatusChange = (id: string, status: TodoStatus) => {
    updateTodoStatus.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      deleteTodo.mutate(id);
    }
  };

  return (
    <div className="app">
      <Header 
        userName={user?.signInDetails?.loginId}
        onSignOut={signOut}
        onAddTodo={openModal}
      />
      <main className="app__main">
        <TodoList
          todos={filteredTodos}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </main>
      <footer className="app__footer">
        Gestor de Tareas - Powered by AWS Amplify
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
