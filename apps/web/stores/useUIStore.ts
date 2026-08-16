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
  openCommentsDrawer: (eventId: string) => void;
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
  openCommentsDrawer: (eventId) => set({ activeCommentsEventId: eventId }),
  closeCommentsDrawer: () => set({ activeCommentsEventId: null }),

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
}));
