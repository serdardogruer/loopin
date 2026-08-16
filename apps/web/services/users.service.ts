import { apiClient } from './api';
import { User } from '@loopin/types';
import { UpdateProfileInput } from '@loopin/validation';

export interface FollowUserItem {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  trustScore?: string;
  isFollowing: boolean;
  isSelf: boolean;
}

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

  async toggleFollow(targetUserId: string): Promise<{ isFollowing: boolean; followerCount: number }> {
    return apiClient<{ isFollowing: boolean; followerCount: number }>(`/users/${targetUserId}/follow`, {
      method: 'POST',
    });
  },

  async getFollowers(targetUserId: string): Promise<FollowUserItem[]> {
    return apiClient<FollowUserItem[]>(`/users/${targetUserId}/followers`, {
      method: 'GET',
    });
  },

  async getFollowing(targetUserId: string): Promise<FollowUserItem[]> {
    return apiClient<FollowUserItem[]>(`/users/${targetUserId}/following`, {
      method: 'GET',
    });
  },
};
