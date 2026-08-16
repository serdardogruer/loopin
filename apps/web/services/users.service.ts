import { apiClient } from './api';
import { User } from '@loopin/types';
import { UpdateProfileInput } from '@loopin/validation';

export const usersService = {
  async getProfile(username: string): Promise<User> {
    const cleanUsername = username.replace(/^@/, '');
    return apiClient<User>(`/users/${cleanUsername}`, {
      method: 'GET',
    });
  },

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    return apiClient<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
