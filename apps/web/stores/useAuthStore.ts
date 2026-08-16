import { create } from 'zustand';
import { User } from '@loopin/types';
import { authService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '@loopin/validation';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('loopin_token') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(data);
      const token = res.tokens?.accessToken || (res as any).accessToken;
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('loopin_token', token);
      }
      set({
        user: res.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Giriş yapılamadı', isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(data);
      const token = res.tokens?.accessToken || (res as any).accessToken;
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('loopin_token', token);
      }
      set({
        user: res.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Kayıt olunamadı', isLoading: false });
      throw err;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loopin_token');
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('loopin_token') : null;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const user = await authService.getMe();
      set({ user, token, isAuthenticated: true });
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('loopin_token');
      }
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  updateUserProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

  setUser: (user) => set({ user, isAuthenticated: true }),
}));
