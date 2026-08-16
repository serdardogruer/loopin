import React from 'react';
import { cn } from '../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl select-none';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95',
      secondary:
        'bg-[#2A2A2A] text-white hover:bg-[#333333] border border-white/5',
      outline:
        'bg-transparent text-white border border-white/20 hover:bg-white/5',
      ghost:
        'bg-transparent text-white/80 hover:text-white hover:bg-white/10',
      danger:
        'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
      md: 'px-4 py-2.5 text-sm font-semibold rounded-xl',
      lg: 'px-6 py-3 text-base font-bold rounded-2xl',
      icon: 'h-10 w-10 p-0 rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
