import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-lg focus:outline-none focus:ring-2 focus:ring-lime/50';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 gap-2 font-medium',
    lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-lime text-midnight hover:bg-lime-glow hover:shadow-[0_0_20px_rgba(198,243,107,0.3)] active:bg-lime-dim font-heading font-semibold tracking-wide',
    secondary:
      'bg-charcoal-elevated text-slate-100 hover:bg-charcoal-border border border-charcoal-border hover:border-slate-500',
    outline:
      'border border-lime/60 text-lime hover:bg-lime/10 active:bg-lime/20',
    ghost:
      'text-slate-300 hover:text-white hover:bg-charcoal-surface active:bg-charcoal-elevated',
    danger:
      'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 active:bg-rose-500/40',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
