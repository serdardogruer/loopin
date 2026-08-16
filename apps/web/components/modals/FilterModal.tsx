'use client';

import React from 'react';
import { useDiscoveryStore } from '../../stores/useDiscoveryStore';

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

export const FilterModal: React.FC = () => {
  const {
    isFilterModalOpen,
    closeFilterModal,
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    selectedAgeRange,
    setSelectedAgeRange,
    openDiscoveryModal,
    settings,
    resetFilters,
  } = useDiscoveryStore();

  if (!isFilterModalOpen) return null;

  const hasActiveFilters = selectedCategory !== 'Tümü' || selectedAgeRange !== 'Tüm Yaşlar' || viewMode === 'map';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeFilterModal}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#141A29] border border-white/10 p-5 shadow-2xl animate-scale-up text-white flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h3 className="text-sm font-bold text-white font-['Outfit']">Etkinlik Filtreleri</h3>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold"
              >
                Sıfırla
              </button>
            )}
            <button
              onClick={closeFilterModal}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center text-xs ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 1. View Mode (Akış / Harita) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            Görünüm Modu
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#0A0E1A] p-1 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setViewMode('feed')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'feed'
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              📋 Akış (Liste)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🗺️ Harita (Map)
            </button>
          </div>
        </div>

        {/* 2. Categories */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            Etkinlik Kategorisi
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#0A0E1A] rounded-2xl border border-white/5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-3 py-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Age Range Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            🎂 Yaş Tercihi
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-[#0A0E1A] rounded-2xl border border-white/5">
            {AGE_RANGES.map((age) => {
              const isSelected = selectedAgeRange === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAgeRange(age)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Advanced Discovery Settings Link */}
        <div
          onClick={openDiscoveryModal}
          className="p-3 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 flex items-center justify-between cursor-pointer hover:border-indigo-500/60 transition-all"
        >
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>📍 Keşif & Mesafe Ayarları</span>
              <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                {settings.maxDistanceKm} km / {settings.lookingForGender}
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">
              Tinder tarzı detaylı mesafe ve cinsiyet tercihlerini düzenle
            </div>
          </div>
          <span className="text-indigo-400 text-base font-bold">›</span>
        </div>

        {/* Apply Button */}
        <div className="pt-2">
          <button
            onClick={closeFilterModal}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            Filtreleri Uygula
          </button>
        </div>
      </div>
    </div>
  );
};
