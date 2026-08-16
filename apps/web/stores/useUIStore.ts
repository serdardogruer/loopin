import { create } from 'zustand';
import { EventItem, ReelItem } from '@loopin/types';

export type MainTab = 'home' | 'reels' | 'messages' | 'profile';
export type ProfileSubTab = 'reels' | 'events';
export type AuthModalMode = 'login' | 'register';

interface UIState {
  currentTab: MainTab;
  setCurrentTab: (tab: MainTab) => void;

  currentProfileSubTab: ProfileSubTab;
  setCurrentProfileSubTab: (subTab: ProfileSubTab) => void;

  // Modals
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;

  isEditProfileModalOpen: boolean;
  openEditProfileModal: () => void;
  closeEditProfileModal: () => void;

  // Detail Lightbox Modal
  detailItem: { type: 'event' | 'reel'; data: EventItem | ReelItem } | null;
  openDetailModal: (type: 'event' | 'reel', data: EventItem | ReelItem) => void;
  closeDetailModal: () => void;

  // Comments Drawer
  activeCommentsEventId: string | null;
  activeCommentsReelId: string | null;
  openCommentsDrawer: (eventId: string) => void;
  openReelCommentsDrawer: (reelId: string) => void;
  closeCommentsDrawer: () => void;

  // Auth Modal
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;

  // Settings Modal
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  // Notifications Drawer
  isNotificationsOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;

  // Public User Profile Sheet
  activeProfileUserId: string | null;
  openProfileSheet: (userId: string) => void;
  closeProfileSheet: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentTab: 'home',
  setCurrentTab: (tab) => set({ currentTab: tab }),

  currentProfileSubTab: 'reels',
  setCurrentProfileSubTab: (subTab) => set({ currentProfileSubTab: subTab }),

  isCreateModalOpen: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  isEditProfileModalOpen: false,
  openEditProfileModal: () => set({ isEditProfileModalOpen: true }),
  closeEditProfileModal: () => set({ isEditProfileModalOpen: false }),

  detailItem: null,
  openDetailModal: (type, data) => set({ detailItem: { type, data } }),
  closeDetailModal: () => set({ detailItem: null }),

  activeCommentsEventId: null,
  activeCommentsReelId: null,
  openCommentsDrawer: (eventId) => set({ activeCommentsEventId: eventId, activeCommentsReelId: null }),
  openReelCommentsDrawer: (reelId) => set({ activeCommentsReelId: reelId, activeCommentsEventId: null }),
  closeCommentsDrawer: () => set({ activeCommentsEventId: null, activeCommentsReelId: null }),

  isAuthModalOpen: false,
  authModalMode: 'login',
  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  isSettingsModalOpen: false,
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),

  isNotificationsOpen: false,
  openNotifications: () => set({ isNotificationsOpen: true }),
  closeNotifications: () => set({ isNotificationsOpen: false }),

  activeProfileUserId: null,
  openProfileSheet: (userId) => set({ activeProfileUserId: userId }),
  closeProfileSheet: () => set({ activeProfileUserId: null }),
}));
