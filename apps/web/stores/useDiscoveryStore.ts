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
  isFilterModalOpen: boolean;
  viewMode: 'feed' | 'map';
  selectedCategory: string;
  selectedAgeRange: string;

  openDiscoveryModal: () => void;
  closeDiscoveryModal: () => void;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  setViewMode: (mode: 'feed' | 'map') => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedAgeRange: (age: string) => void;
  updateSettings: (newSettings: Partial<DiscoverySettings>) => void;
  resetFilters: () => void;
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
      isFilterModalOpen: false,
      viewMode: 'feed',
      selectedCategory: 'Tümü',
      selectedAgeRange: 'Tüm Yaşlar',

      openDiscoveryModal: () => set({ isDiscoveryModalOpen: true, isFilterModalOpen: false }),
      closeDiscoveryModal: () => set({ isDiscoveryModalOpen: false }),
      openFilterModal: () => set({ isFilterModalOpen: true }),
      closeFilterModal: () => set({ isFilterModalOpen: false }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSelectedAgeRange: (age) => set({ selectedAgeRange: age }),
      resetFilters: () => set({ selectedCategory: 'Tümü', selectedAgeRange: 'Tüm Yaşlar', viewMode: 'feed' }),
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
