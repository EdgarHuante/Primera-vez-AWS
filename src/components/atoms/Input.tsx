import React, { useId } from 'react';
import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''}`}>
      {label && <label htmlFor={inputId} className="input-wrapper__label">{label}</label>}
      <input id={inputId} className={`input-wrapper__input ${className}`} {...props} />
      {error && <span className="input-wrapper__error">{error}</span>}
    </div>
  );
};
