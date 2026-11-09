import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DomainClassification, PriorityLevel } from '../../types/curriculum';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'lime' | 'cyan' | 'orange' | 'neutral' | 'purple' | 'emerald';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide',
  };

  const variantStyles = {
    lime: 'bg-lime/10 text-lime border border-lime/30 font-semibold',
    cyan: 'bg-cyan/10 text-cyan border border-cyan/30 font-medium',
    orange: 'bg-orange/10 text-orange border border-orange/30 font-medium',
    neutral: 'bg-charcoal-elevated text-slate-300 border border-charcoal-border',
    purple: 'bg-purple-500/10 text-purple-300 border border-purple-500/30 font-medium',
    emerald: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 uppercase font-heading rounded-md',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const ClassificationBadge: React.FC<{ classification: DomainClassification; size?: 'sm' | 'md' }> = ({
  classification,
  size = 'sm',
}) => {
  let variant: BadgeProps['variant'] = 'neutral';

  switch (classification) {
    case 'CORE SKILL':
      variant = 'lime';
      break;
    case 'MAJOR DIFFERENTIATOR':
      variant = 'orange';
      break;
    case 'PROFESSIONAL SKILL':
      variant = 'cyan';
      break;
    case 'CAREER DIFFERENTIATOR / PRACTICAL SKILL':
      variant = 'orange';
      break;
    case 'ADDITIONAL TECHNICAL KNOWLEDGE':
      variant = 'purple';
      break;
    case 'ADVANCED / OPTIONAL FOR ENTRY-LEVEL ANALYSTS':
      variant = 'neutral';
      break;
    case 'EMERGING PROFESSIONAL SKILL':
      variant = 'cyan';
      break;
    case 'PROFESSIONAL KNOWLEDGE':
      variant = 'purple';
      break;
    case 'CAREER PREPARATION':
      variant = 'emerald';
      break;
    case 'SPECIALIZATION / CAREER DEVELOPMENT':
      variant = 'orange';
      break;
    default:
      variant = 'neutral';
  }

  return (
    <Badge variant={variant} size={size}>
      {classification}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{ level: PriorityLevel; size?: 'sm' | 'md' }> = ({ level, size = 'sm' }) => {
  const colorMap: Record<PriorityLevel, BadgeProps['variant']> = {
    'Level 1': 'lime',
    'Level 2': 'cyan',
    'Level 3': 'orange',
    'Level 4': 'purple',
    'Level 5': 'emerald',
  };

  return (
    <Badge variant={colorMap[level]} size={size}>
      {level}
    </Badge>
  );
};
