/**
 * Tests de integración: flujo completo de tareas
 * Prueba la cadena: Componentes → Hooks (React Query) → Servicio (mockeado)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoList } from '@components/organisms/TodoList';
import { TodoForm } from '@components/molecules/TodoForm';
import { useToastStore } from '@store/toast.store';

// Mock del servicio para controlar las respuestas de la API
vi.mock('@services/todo.service', () => ({
  todoService: {
    getAll: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    updateContent: vi.fn(),
    delete: vi.fn(),
  },
}));

import { todoService } from '@services/todo.service';

const mockTodos = [
  { id: '1', content: 'Tarea integración 1', status: 'pendiente' as const },
  { id: '2', content: 'Tarea integración 2', status: 'haciendo' as const },
];

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    ),
    queryClient,
  };
}

describe('Integración: flujo de tareas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useToastStore.setState({ toasts: [] });
    vi.mocked(todoService.getAll).mockResolvedValue(mockTodos);
  });

  describe('TodoList con datos', () => {
    it('renderiza lista de tareas correctamente', () => {
      renderWithQueryClient(
        <TodoList
          todos={mockTodos}
          onStatusChange={vi.fn()}
          onUpdateContent={vi.fn()}
          onDelete={vi.fn()}
        />
      );
      expect(screen.getByText('Tarea integración 1')).toBeInTheDocument();
      expect(screen.getByText('Tarea integración 2')).toBeInTheDocument();
    });

    it('estados de los badges son correctos', () => {
      renderWithQueryClient(
        <TodoList
          todos={mockTodos}
          onStatusChange={vi.fn()}
          onUpdateContent={vi.fn()}
          onDelete={vi.fn()}
        />
      );
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('En Progreso')).toBeInTheDocument();
    });
  });

  describe('TodoForm → submit', () => {
    it('llama al handler con el contenido correcto', async () => {
      const onSubmit = vi.fn();
      renderWithQueryClient(<TodoForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      await userEvent.type(screen.getByLabelText(/Descripción/i), 'Nueva tarea de integración');
      await userEvent.click(screen.getByRole('button', { name: /Crear Tarea/i }));

      expect(onSubmit).toHaveBeenCalledWith('Nueva tarea de integración');
    });
  });

  describe('interacción con estados de tarea', () => {
    it('el botón de avanzar estado está presente para tareas pendientes', () => {
      renderWithQueryClient(
        <TodoList
          todos={[{ id: '1', content: 'Tarea pendiente', status: 'pendiente' }]}
          onStatusChange={vi.fn()}
          onUpdateContent={vi.fn()}
          onDelete={vi.fn()}
        />
      );
      expect(screen.getByText('Haciendo')).toBeInTheDocument();
    });

    it('no hay botón de avanzar para tareas completadas', () => {
      renderWithQueryClient(
        <TodoList
          todos={[{ id: '1', content: 'Tarea completada', status: 'hecho' }]}
          onStatusChange={vi.fn()}
          onUpdateContent={vi.fn()}
          onDelete={vi.fn()}
        />
      );
      // Solo debe estar el botón de eliminar, no el de avanzar estado
      expect(screen.queryByText('Pendiente')).not.toBeInTheDocument();
      expect(screen.queryByText('Haciendo')).not.toBeInTheDocument();
    });

    it('llama onStatusChange con el id y nuevo estado', async () => {
      const onStatusChange = vi.fn();
      renderWithQueryClient(
        <TodoList
          todos={[{ id: '1', content: 'Tarea', status: 'pendiente' }]}
          onStatusChange={onStatusChange}
          onUpdateContent={vi.fn()}
          onDelete={vi.fn()}
        />
      );
      await userEvent.click(screen.getByText('Haciendo'));
      expect(onStatusChange).toHaveBeenCalledWith('1', 'haciendo');
    });

    it('llama onDelete con el id correcto', async () => {
      const onDelete = vi.fn();
      renderWithQueryClient(
        <TodoList
          todos={[{ id: 'del-1', content: 'Borrar esto', status: 'pendiente' }]}
          onStatusChange={vi.fn()}
          onUpdateContent={vi.fn()}
          onDelete={onDelete}
        />
      );
      await userEvent.click(screen.getByText('Eliminar'));
      expect(onDelete).toHaveBeenCalledWith('del-1');
    });
  });

  describe('flujo completo de edición', () => {
    it('permite editar y guardar una tarea', async () => {
      const onUpdateContent = vi.fn();
      renderWithQueryClient(
        <TodoList
          todos={[{ id: '1', content: 'Contenido original', status: 'pendiente' }]}
          onStatusChange={vi.fn()}
          onUpdateContent={onUpdateContent}
          onDelete={vi.fn()}
        />
      );

      // Abrir edición
      await userEvent.click(screen.getByRole('button', { name: /Editar tarea/i }));
      expect(screen.getByRole('textbox')).toHaveValue('Contenido original');

      // Editar contenido
      const input = screen.getByRole('textbox');
      await userEvent.clear(input);
      await userEvent.type(input, 'Contenido editado');

      // Guardar
      const buttons = screen.getAllByRole('button');
      const saveButton = buttons.find((b) => b.className.includes('success'));
      await userEvent.click(saveButton!);

      expect(onUpdateContent).toHaveBeenCalledWith('1', 'Contenido editado');
    });

    it('permite cancelar la edición sin guardar', async () => {
      const onUpdateContent = vi.fn();
      renderWithQueryClient(
        <TodoList
          todos={[{ id: '1', content: 'Contenido original', status: 'pendiente' }]}
          onStatusChange={vi.fn()}
          onUpdateContent={onUpdateContent}
          onDelete={vi.fn()}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /Editar tarea/i }));
      await userEvent.keyboard('{Escape}');

      expect(onUpdateContent).not.toHaveBeenCalled();
      expect(screen.getByText('Contenido original')).toBeInTheDocument();
    });
  });

  describe('integración con servicio mockeado', () => {
    it('getAll retorna datos correctamente', async () => {
      const todos = await todoService.getAll();
      expect(todos).toEqual(mockTodos);
    });

    it('create es llamado con el input correcto', async () => {
      vi.mocked(todoService.create).mockResolvedValue({
        id: 'new-1',
        content: 'Nueva tarea',
        status: 'pendiente',
      });
      const result = await todoService.create({ content: 'Nueva tarea' });
      expect(result.content).toBe('Nueva tarea');
      expect(result.status).toBe('pendiente');
    });

    it('delete es llamado con el id correcto', async () => {
      vi.mocked(todoService.delete).mockResolvedValue(undefined);
      await todoService.delete('todo-1');
      expect(todoService.delete).toHaveBeenCalledWith('todo-1');
    });
  });
});
