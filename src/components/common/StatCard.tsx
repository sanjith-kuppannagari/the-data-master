import React from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'lime' | 'cyan' | 'orange' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  trend,
  accentColor = 'lime',
}) => {
  const accentBorder = {
    lime: 'hover:border-lime/40',
    cyan: 'hover:border-cyan/40',
    orange: 'hover:border-orange/40',
    neutral: 'hover:border-slate-500',
  };

  const iconBg = {
    lime: 'bg-lime/10 text-lime border-lime/20',
    cyan: 'bg-cyan/10 text-cyan border-cyan/20',
    orange: 'bg-orange/10 text-orange border-orange/20',
    neutral: 'bg-charcoal-elevated text-slate-300 border-charcoal-border',
  };

  return (
    <Card className={clsx('p-5 transition-all duration-200 border-charcoal-border', accentBorder[accentColor])}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-mono font-medium block mb-1">
            {label}
          </span>
          <div className="text-2xl font-heading font-bold text-slate-100 tracking-tight">
            {value}
          </div>
          {sublabel && (
            <p className="text-xs text-slate-400 mt-1">{sublabel}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
              <span className={trend.isPositive ? 'text-lime' : 'text-rose-400'}>
                {trend.value}
              </span>
              <span className="text-slate-500 text-[11px]">vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={clsx('p-2.5 rounded-lg border', iconBg[accentColor])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
