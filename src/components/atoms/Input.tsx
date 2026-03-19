import { useId, type InputHTMLAttributes } from 'react';
import './Input.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', id, ...props }: InputProps) => {
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
