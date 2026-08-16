import { apiClient } from './api';
import { ReelItem } from '@loopin/types';
import { CreateReelInput } from '@loopin/validation';

export const reelsService = {
  async getFeed(): Promise<ReelItem[]> {
    return apiClient<ReelItem[]>('/reels/feed', {
      method: 'GET',
    });
  },

  async create(data: CreateReelInput): Promise<ReelItem> {
    return apiClient<ReelItem>('/reels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async toggleLike(id: string): Promise<{ liked: boolean }> {
    return apiClient<{ liked: boolean }>(`/reels/${id}/like`, {
      method: 'POST',
    });
  },

  async addComment(id: string, text: string): Promise<any> {
    return apiClient(`/reels/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};
