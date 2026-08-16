import { apiClient } from './api';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: {
    eventId?: string;
    eventTitle?: string;
    applicationId?: string;
    applicantId?: string;
    applicantName?: string;
    applicantAvatar?: string;
    followerId?: string;
    followerUsername?: string;
    followerName?: string;
    followerAvatar?: string;
    likerId?: string;
    commentId?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

export const notificationsService = {
  async getNotifications(): Promise<NotificationsResponse> {
    return apiClient<NotificationsResponse>('/notifications', {
      method: 'GET',
    });
  },

  async markAsRead(id: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
    });
  },
};
