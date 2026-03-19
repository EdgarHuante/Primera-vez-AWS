import React from 'react';
import type { TodoStatus } from '../../types/todo';
import { STATUS_LABELS } from '../../types/todo';
import './Badge.scss';

interface BadgeProps {
  status: TodoStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span className={`badge badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};
