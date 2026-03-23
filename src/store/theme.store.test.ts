import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from './theme.store';

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ theme: 'light' });
    document.documentElement.removeAttribute('data-theme');
  });

  describe('estado inicial', () => {
    it('tema por defecto es "light"', () => {
      expect(useThemeStore.getState().theme).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('cambia de light a dark', () => {
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe('dark');
    });

    it('cambia de dark a light', () => {
      useThemeStore.setState({ theme: 'dark' });
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe('light');
    });

    it('actualiza atributo data-theme en el documento', () => {
      useThemeStore.getState().toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('vuelve a light con segundo toggle', () => {
      useThemeStore.getState().toggleTheme();
      useThemeStore.getState().toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('establece tema dark directamente', () => {
      useThemeStore.getState().setTheme('dark');
      expect(useThemeStore.getState().theme).toBe('dark');
    });

    it('establece tema light directamente', () => {
      useThemeStore.setState({ theme: 'dark' });
      useThemeStore.getState().setTheme('light');
      expect(useThemeStore.getState().theme).toBe('light');
    });

    it('actualiza atributo data-theme al establecer tema', () => {
      useThemeStore.getState().setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
