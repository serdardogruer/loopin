'use client';

import React from 'react';
import { useDiscoveryStore } from '../../stores/useDiscoveryStore';

interface HomeFeedFiltersProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedAgeRange: string;
  onSelectAgeRange: (age: string) => void;
}

const CATEGORIES = [
  'Tümü',
  'Müzik & Konser',
  'Kahve & Yemek',
  'Doğa & Spor',
  'Sinema & Kültür',
  'Teknoloji & Hobi',
  'Gece Hayatı & Parti',
];

const AGE_RANGES = [
  'Tüm Yaşlar',
  '18 - 25 Yaş',
  '20 - 35 Yaş',
  '25 - 45 Yaş',
  '30+ Yaş',
];

export const HomeFeedFilters: React.FC<HomeFeedFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedAgeRange,
  onSelectAgeRange,
}) => {
  const { viewMode, setViewMode, openDiscoveryModal, settings } = useDiscoveryStore();

  return (
    <div className="flex flex-col gap-1.5 px-3 py-2 bg-black/50 backdrop-blur-md border-b border-white/5 z-20 sticky top-0">
      {/* Top Controls: View Mode & Discovery Settings */}
      <div className="flex items-center justify-between gap-2">
        {/* Feed / Map Toggle */}
        <div className="flex bg-[#1E293B]/80 p-0.5 rounded-full border border-white/10">
          <button
            onClick={() => setViewMode('feed')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              viewMode === 'feed'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            📋 Akış
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🗺️ Harita
          </button>
        </div>

        {/* Discovery Filter Trigger Button */}
        <button
          onClick={openDiscoveryModal}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-[11px] font-bold text-neutral-200 active:scale-95 transition-all"
        >
          <span>⚙️</span>
          <span>Keşif ({settings.maxDistanceKm}km)</span>
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Age Range Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[10px] text-neutral-500 font-semibold pl-1">🎂 Yaş:</span>
        {AGE_RANGES.map((age) => {
          const isSelected = selectedAgeRange === age;
          return (
            <button
              key={age}
              onClick={() => onSelectAgeRange(age)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-500/50'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-transparent'
              }`}
            >
              {age}
            </button>
          );
        })}
      </div>
    </div>
  );
};
