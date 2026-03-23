import { useEffect, useState } from 'react';
import type { Toast as ToastType } from '@store/toast.store';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.scss';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export const Toast = ({ toast, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const IconComponent = icons[toast.type];
  const duration = toast.duration ?? 4000;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast--${toast.type} ${isExiting ? 'toast--exiting' : ''}`}>
      <div className="toast__icon">
        <IconComponent size={20} />
      </div>
      <div className="toast__content">
        <p className="toast__message">{toast.message}</p>
        {toast.action && (
          <button className="toast__action" onClick={toast.action.onClick}>
            {toast.action.label}
          </button>
        )}
      </div>
      <button className="toast__close" onClick={handleClose} aria-label="Cerrar">
        <XCircle size={18} />
      </button>
      <div
        className="toast__progress"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};
