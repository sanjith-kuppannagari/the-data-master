import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'interactive';
  glowing?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  glowing = false,
  className,
  ...props
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200 overflow-hidden';

  const variantStyles = {
    default: 'bg-charcoal-surface border border-charcoal-border/80 text-slate-100',
    elevated: 'bg-charcoal-elevated border border-charcoal-border shadow-lg text-slate-100',
    bordered: 'bg-midnight border border-charcoal-border text-slate-100',
    interactive:
      'bg-charcoal-surface border border-charcoal-border hover:border-lime/40 hover:bg-charcoal-elevated/70 text-slate-100 cursor-pointer hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
  };

  const glowStyle = glowing ? 'ring-1 ring-lime/40 shadow-[0_0_25px_rgba(198,243,107,0.1)]' : '';

  return (
    <div className={twMerge(clsx(baseStyles, variantStyles[variant], glowStyle, className))} {...props}>
      {children}
    </div>
  );
};
