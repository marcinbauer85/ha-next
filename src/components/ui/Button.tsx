import { clsx } from 'clsx';
import { Icon } from './Icon';

interface ButtonProps {
  icon?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-surface-low hover:bg-surface-lower text-text-primary',
  primary: 'bg-fill-primary-normal hover:bg-fill-primary-quiet text-text-primary',
  ghost: 'bg-transparent hover:bg-surface-low text-text-secondary',
};

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

const iconSizes = {
  sm: 18,
  md: 20,
  lg: 24,
};

export function Button({
  icon,
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-ha-lg transition-colors flex items-center justify-center gap-2',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <Icon path={icon} size={iconSizes[size]} />}
      {children}
    </button>
  );
}
