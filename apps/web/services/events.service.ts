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

  async toggleJoin(id: string): Promise<any> {
    return apiClient<any>(`/events/${id}/join`, {
      method: 'POST',
    });
  },

  async apply(id: string, note?: string): Promise<{ status: string; message: string; applicationId?: string }> {
    return apiClient<{ status: string; message: string; applicationId?: string }>(`/events/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  async approveApplication(applicationId: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/events/applications/${applicationId}/approve`, {
      method: 'POST',
    });
  },

  async rejectApplication(applicationId: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/events/applications/${applicationId}/reject`, {
      method: 'POST',
    });
  },

  async getApplications(eventId: string): Promise<any[]> {
    return apiClient<any[]>(`/events/${eventId}/applications`, {
      method: 'GET',
    });
  },

  async addComment(id: string, text: string): Promise<any> {
    return apiClient(`/events/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};
