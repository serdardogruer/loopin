import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'message' | 'notification' | 'system';
  title: string;
  body: string;
  avatarUrl?: string;
  actionType?: 'open_chat' | 'open_notifications' | 'open_profile';
  targetId?: string;
  createdAt: number;
}

interface ToastState {
  activeToast: ToastItem | null;
  showToast: (toast: Omit<ToastItem, 'id' | 'createdAt'>) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  activeToast: null,

  showToast: (toast) => {
    const id = Date.now().toString();
    set({
      activeToast: {
        ...toast,
        id,
        createdAt: Date.now(),
      },
    });

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      set((state) => (state.activeToast?.id === id ? { activeToast: null } : state));
    }, 5000);
  },

  hideToast: () => set({ activeToast: null }),
}));
