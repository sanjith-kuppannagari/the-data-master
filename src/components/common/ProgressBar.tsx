import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  value: number; // 0 - 100
  variant?: 'lime' | 'cyan' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'lime',
  size = 'md',
  showLabel = false,
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const fillVariants = {
    lime: 'bg-lime shadow-[0_0_12px_rgba(198,243,107,0.4)]',
    cyan: 'bg-cyan shadow-[0_0_12px_rgba(117,214,208,0.4)]',
    orange: 'bg-orange shadow-[0_0_12px_rgba(255,170,115,0.4)]',
  };

  return (
    <div className={twMerge('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-400">
          <span>PROGRESS</span>
          <span className="text-slate-200 font-semibold">{clamped}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-charcoal-border/70 rounded-full overflow-hidden p-0.5', sizeStyles[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', fillVariants[variant])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
