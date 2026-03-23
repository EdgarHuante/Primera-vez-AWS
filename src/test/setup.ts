import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Reset localStorage between tests
afterEach(() => {
  localStorage.clear();
});

// Suppress console.error for expected errors in tests
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const msg = args[0];
  if (
    typeof msg === 'string' &&
    (msg.includes('ErrorBoundary') ||
      msg.includes('The above error occurred') ||
      msg.includes('Error: Uncaught'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Global mock for aws-amplify modules to prevent config errors
vi.mock('aws-amplify', () => ({
  Amplify: { configure: vi.fn() },
}));

vi.mock('aws-amplify/auth', () => ({
  getCurrentUser: vi.fn(),
  signOut: vi.fn(),
}));
