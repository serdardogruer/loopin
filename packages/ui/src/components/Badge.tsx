import React from 'react';
import { cn } from '../utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'pro' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    error: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    pro: 'bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold shadow-sm',
    outline: 'bg-white/5 text-neutral-300 border border-white/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
