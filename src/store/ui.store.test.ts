import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './ui.store';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ filter: 'all', isModalOpen: false });
  });

  describe('estado inicial', () => {
    it('filter por defecto es "all"', () => {
      expect(useUIStore.getState().filter).toBe('all');
    });

    it('modal cerrado por defecto', () => {
      expect(useUIStore.getState().isModalOpen).toBe(false);
    });
  });

  describe('setFilter', () => {
    it('cambia el filtro a "pendiente"', () => {
      useUIStore.getState().setFilter('pendiente');
      expect(useUIStore.getState().filter).toBe('pendiente');
    });

    it('cambia el filtro a "haciendo"', () => {
      useUIStore.getState().setFilter('haciendo');
      expect(useUIStore.getState().filter).toBe('haciendo');
    });

    it('cambia el filtro a "hecho"', () => {
      useUIStore.getState().setFilter('hecho');
      expect(useUIStore.getState().filter).toBe('hecho');
    });

    it('cambia de vuelta a "all"', () => {
      useUIStore.getState().setFilter('pendiente');
      useUIStore.getState().setFilter('all');
      expect(useUIStore.getState().filter).toBe('all');
    });
  });

  describe('openModal / closeModal', () => {
    it('openModal abre el modal', () => {
      useUIStore.getState().openModal();
      expect(useUIStore.getState().isModalOpen).toBe(true);
    });

    it('closeModal cierra el modal', () => {
      useUIStore.getState().openModal();
      useUIStore.getState().closeModal();
      expect(useUIStore.getState().isModalOpen).toBe(false);
    });

    it('cerrar modal sin abrirlo no produce error', () => {
      useUIStore.getState().closeModal();
      expect(useUIStore.getState().isModalOpen).toBe(false);
    });
  });
});
