import React from 'react';
import { cn } from '../utils';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  hasStory?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  isOnline,
  hasStory,
  className,
  ...props
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };

  const placeholder = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  return (
    <div className={cn('relative inline-block flex-shrink-0', sizes[size])}>
      <img
        src={src || placeholder}
        alt={alt}
        className={cn(
          'h-full w-full rounded-full object-cover border border-white/10 shadow-sm',
          hasStory && 'ring-2 ring-offset-2 ring-indigo-500 ring-offset-[#0A0A0A]',
          className
        )}
        {...props}
      />
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-[#1A1A1A]',
            isOnline ? 'bg-emerald-500' : 'bg-neutral-500',
            size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'
          )}
        />
      )}
    </div>
  );
};
