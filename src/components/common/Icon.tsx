import {
  Check,
  X,
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Play,
  LogOut,
  Sun,
  Moon,
  ClipboardList,
  ChevronRight,
  Loader2,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export {
  Check,
  X,
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Play,
  LogOut,
  Sun,
  Moon,
  ClipboardList,
  ChevronRight,
  Loader2,
  ListFilter,
  Sparkles,
};

export type IconName = 'Check' | 'X' | 'AlertTriangle' | 'Info' | 'Plus' | 'Trash2' | 'Clock' | 'CheckCircle2' | 'Play' | 'LogOut' | 'Sun' | 'Moon' | 'ClipboardList' | 'ChevronRight' | 'Loader2' | 'ListFilter' | 'Sparkles';

interface IconProps extends LucideProps {
  name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const icons: Record<IconName, typeof Check> = {
    Check,
    X,
    AlertTriangle,
    Info,
    Plus,
    Trash2,
    Clock,
    CheckCircle2,
    Play,
    LogOut,
    Sun,
    Moon,
    ClipboardList,
    ChevronRight,
    Loader2,
    ListFilter,
    Sparkles,
  };
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
};
