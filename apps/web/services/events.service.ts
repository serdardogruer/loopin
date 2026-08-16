import { apiClient } from './api';
import { EventItem } from '@loopin/types';
import { CreateEventInput } from '@loopin/validation';

export const eventsService = {
  async getFeed(): Promise<EventItem[]> {
    return apiClient<EventItem[]>('/events/feed', {
      method: 'GET',
    });
  },

  async getById(id: string): Promise<EventItem> {
    return apiClient<EventItem>(`/events/${id}`, {
      method: 'GET',
    });
  },

  async create(data: CreateEventInput): Promise<EventItem> {
    return apiClient<EventItem>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async toggleLike(id: string): Promise<{ liked: boolean }> {
    return apiClient<{ liked: boolean }>(`/events/${id}/like`, {
      method: 'POST',
    });
  },

  async toggleJoin(id: string): Promise<{ joined: boolean }> {
    return apiClient<{ joined: boolean }>(`/events/${id}/join`, {
      method: 'POST',
    });
  },

  async addComment(id: string, text: string): Promise<any> {
    return apiClient(`/events/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};
