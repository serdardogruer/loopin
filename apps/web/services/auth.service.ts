import { apiClient } from './api';
import { RegisterInput, LoginInput } from '@loopin/validation';
import { User, AuthResponse } from '@loopin/types';

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<User> {
    return apiClient<User>('/auth/me', {
      method: 'GET',
    });
  },
};
