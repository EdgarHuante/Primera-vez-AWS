import { create } from 'zustand';
import type { TodoStatus } from '../types/todo';

export type FilterStatus = TodoStatus | 'all';

interface UIState {
  filter: FilterStatus;
  isModalOpen: boolean;
  setFilter: (filter: FilterStatus) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  filter: 'all',
  isModalOpen: false,
  setFilter: (filter) => set({ filter }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
