import React from 'react';
import './Spinner.scss';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', fullScreen = false }) => {
  const spinnerClass = [
    'spinner',
    `spinner--${size}`,
    fullScreen ? 'spinner--full-screen' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={spinnerClass}>
      <div className="spinner__circle" />
    </div>
  );
};
