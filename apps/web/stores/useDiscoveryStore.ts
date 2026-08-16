import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DiscoverySettings {
  location: string;
  maxDistanceKm: number;
  strictDistance: boolean;
  lookingForGender: 'Kadınlar' | 'Erkekler' | 'Herkes';
  minAge: number;
  maxAge: number;
  strictAge: boolean;
  isGlobal: boolean;
  preferredLanguages: string[];
}

interface DiscoveryState {
  settings: DiscoverySettings;
  isDiscoveryModalOpen: boolean;
  viewMode: 'feed' | 'map';
  openDiscoveryModal: () => void;
  closeDiscoveryModal: () => void;
  setViewMode: (mode: 'feed' | 'map') => void;
  updateSettings: (newSettings: Partial<DiscoverySettings>) => void;
}

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set) => ({
      settings: {
        location: 'Kadıköy, İstanbul',
        maxDistanceKm: 15,
        strictDistance: true,
        lookingForGender: 'Herkes',
        minAge: 20,
        maxAge: 40,
        strictAge: false,
        isGlobal: true,
        preferredLanguages: ['Türkçe', 'İngilizce'],
      },
      isDiscoveryModalOpen: false,
      viewMode: 'feed',

      openDiscoveryModal: () => set({ isDiscoveryModalOpen: true }),
      closeDiscoveryModal: () => set({ isDiscoveryModalOpen: false }),
      setViewMode: (mode) => set({ viewMode: mode }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'loopin-discovery-settings',
    }
  )
);
