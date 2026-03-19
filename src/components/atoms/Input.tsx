import { useId, type InputHTMLAttributes } from 'react';
import './Input.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = ({ label, error, hint, className = '', id, ...props }: InputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`input-wrapper ${error ? 'input-wrapper--error' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-wrapper__label">
          {label}
          {props.required && <span className="input-wrapper__required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-wrapper__input ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="input-wrapper__error">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${inputId}-hint`} className="input-wrapper__hint">
          {hint}
        </span>
      )}
    </div>
  );
};
