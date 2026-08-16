import { create } from 'zustand';
import { User } from '@loopin/types';
import { mockCurrentUser } from '../mock';

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  updateUserProfile: (data: Partial<User>) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockCurrentUser,
  isAuthenticated: true,
  updateUserProfile: (data) =>
    set((state) => ({
      user: { ...state.user, ...data },
    })),
  setUser: (user) => set({ user, isAuthenticated: true }),
}));
