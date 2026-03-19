import React from 'react';
import type { Toast as ToastType, ToastType as TType } from '@store/toast.store';
import './Toast.scss';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

const icons: Record<TType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast__icon">{icons[toast.type]}</span>
      <span className="toast__message">{toast.message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Cerrar">
        ×
      </button>
    </div>
  );
};
