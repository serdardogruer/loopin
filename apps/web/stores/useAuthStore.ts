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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('loopin_token') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await authService.login(data);
      const user = res?.user || res?.data?.user || res;
      const token = res?.tokens?.accessToken || res?.data?.tokens?.accessToken || res?.accessToken;

      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('loopin_token', token);
      }

      set({
        user: user?.id ? user : null,
        token: token || null,
        isAuthenticated: !!user?.id,
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
      const res: any = await authService.register(data);
      const user = res?.user || res?.data?.user || res;
      const token = res?.tokens?.accessToken || res?.data?.tokens?.accessToken || res?.accessToken;

      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('loopin_token', token);
      }

      set({
        user: user?.id ? user : null,
        token: token || null,
        isAuthenticated: !!user?.id,
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
      const res: any = await authService.getMe();
      const user = res?.id ? res : (res?.data || null);
      if (user && user.id) {
        set({ user, token, isAuthenticated: true });
      } else {
        throw new Error('Geçersiz kullanıcı');
      }
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
