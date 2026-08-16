import { create } from 'zustand';
import { notificationsService, NotificationItem } from '../services/notifications.service';
import { eventsService } from '../services/events.service';

interface NotificationsState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  approveApplication: (applicationId: string, notificationId?: string) => Promise<boolean>;
  rejectApplication: (applicationId: string, notificationId?: string) => Promise<boolean>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await notificationsService.getNotifications();
      if (res) {
        set({
          notifications: res.notifications || [],
          unreadCount: res.unreadCount || 0,
        });
      }
    } catch {
      // Keep existing
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await notificationsService.markAsRead(id);
    } catch {}
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    try {
      await notificationsService.markAllAsRead();
    } catch {}
  },

  approveApplication: async (applicationId: string, notificationId?: string) => {
    try {
      const res = await eventsService.approveApplication(applicationId);
      if (res.success) {
        if (notificationId) {
          get().markAsRead(notificationId);
        }
        get().fetchNotifications();
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.message || 'Onaylanamadı');
      return false;
    }
  },

  rejectApplication: async (applicationId: string, notificationId?: string) => {
    try {
      const res = await eventsService.rejectApplication(applicationId);
      if (res.success) {
        if (notificationId) {
          get().markAsRead(notificationId);
        }
        get().fetchNotifications();
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.message || 'Reddedilemedi');
      return false;
    }
  },
}));
