import React, { useEffect } from 'react';
import { cn } from '../utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#1A1A1A] border border-white/10 p-6 shadow-2xl animate-scale-up',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          {title ? (
            <h3 className="text-lg font-bold text-white font-['Outfit']">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
