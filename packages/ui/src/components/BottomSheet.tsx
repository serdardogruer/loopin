import React, { useEffect } from 'react';
import { cn } from '../utils';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full max-w-lg rounded-t-[32px] bg-[#1A1A1A] border-t border-white/10 p-5 shadow-2xl animate-slide-up max-h-[85vh] flex flex-col',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white font-['Outfit']">{title}</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
        <div className="mt-3 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
