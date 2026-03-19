import type { TaskStatus } from '@domain/task';
import { Clock, Play, CheckCircle2 } from 'lucide-react';
import './Badge.scss';

interface BadgeProps {
  status: TaskStatus;
}

const statusConfig = {
  pendiente: { icon: Clock, label: 'Pendiente' },
  haciendo: { icon: Play, label: 'En Progreso' },
  hecho: { icon: CheckCircle2, label: 'Completado' },
};

export const Badge = ({ status }: BadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`badge badge--${status}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
};
