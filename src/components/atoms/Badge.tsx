import type { TaskStatus } from '@domain/task';
import { STATUS_LABELS } from '@domain/task';
import './Badge.scss';

interface BadgeProps {
  status: TaskStatus;
}

export const Badge = ({ status }: BadgeProps) => {
  return (
    <span className={`badge badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};
