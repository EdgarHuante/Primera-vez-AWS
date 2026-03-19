import { Loader2 } from 'lucide-react';
import './Spinner.scss';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

const sizeMap = {
  small: 16,
  medium: 24,
  large: 32,
};

export const Spinner = ({ size = 'medium', fullScreen = false, text }: SpinnerProps) => {
  return (
    <div className={`spinner ${fullScreen ? 'spinner--full-screen' : ''}`}>
      <Loader2 size={sizeMap[size]} className="spinner__icon" />
      {text && <span className="spinner__text">{text}</span>}
    </div>
  );
};
