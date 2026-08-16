'use client';

import React, { useState } from 'react';
import { useDiscoveryStore } from '../../stores/useDiscoveryStore';

export const DiscoverySettingsModal: React.FC = () => {
  const { settings, isDiscoveryModalOpen, closeDiscoveryModal, updateSettings } = useDiscoveryStore();

  const [genderModalOpen, setGenderModalOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);

  if (!isDiscoveryModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={closeDiscoveryModal}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#111111] border border-white/10 p-5 shadow-2xl animate-scale-up text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 font-['Outfit']">
            KEŞİF AYARLARI
          </h3>
          <button
            onClick={closeDiscoveryModal}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 py-2 text-xs">
          {/* 1. Konum */}
          <div className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80">
            <span className="font-semibold text-neutral-200">Konum</span>
            <div className="flex items-center gap-1 text-neutral-400">
              <span className="text-indigo-400 font-medium">{settings.location}</span>
              <span className="text-neutral-500 text-sm">›</span>
            </div>
          </div>

          {/* 2. Mesafe Tercihi Slider */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-200">Mesafe Tercihi</span>
              <span className="text-white font-bold">{settings.maxDistanceKm} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={settings.maxDistanceKm}
              onChange={(e) => updateSettings({ maxDistanceKm: Number(e.target.value) })}
              className="w-full accent-red-500 h-1.5 bg-neutral-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3. Sadece bu aralıktaki kişileri göster Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-neutral-300 pr-2">Sadece bu aralıktaki kişileri göster</span>
            <button
              type="button"
              onClick={() => updateSettings({ strictDistance: !settings.strictDistance })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.strictDistance ? 'bg-red-500' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.strictDistance ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Aradığım */}
          <div
            onClick={() => setGenderModalOpen(!genderModalOpen)}
            className="flex items-center justify-between py-2 border-t border-white/5 cursor-pointer hover:opacity-80"
          >
            <span className="font-semibold text-neutral-200">Aradığım</span>
            <div className="flex items-center gap-1 text-neutral-400">
              <span className="text-neutral-300 font-medium">{settings.lookingForGender}</span>
              <span className="text-neutral-500 text-sm">›</span>
            </div>
          </div>

          {genderModalOpen && (
            <div className="bg-[#1A1A1A] p-2 rounded-2xl flex gap-2 border border-white/5 animate-fade-in">
              {(['Herkes', 'Kadınlar', 'Erkekler'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    updateSettings({ lookingForGender: g });
                    setGenderModalOpen(false);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                    settings.lookingForGender === g ? 'bg-red-500 text-white' : 'bg-white/5 text-neutral-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {/* 5. Yaş Tercihi Slider */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-200">Yaş Tercihi</span>
              <span className="text-white font-bold">
                {settings.minAge} - {settings.maxAge}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={18}
                max={50}
                value={settings.minAge}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= settings.maxAge) updateSettings({ minAge: val });
                }}
                className="w-full accent-red-500 h-1.5 bg-neutral-700 rounded-lg cursor-pointer"
              />
              <input
                type="range"
                min={18}
                max={70}
                value={settings.maxAge}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= settings.minAge) updateSettings({ maxAge: val });
                }}
                className="w-full accent-red-500 h-1.5 bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* 6. Sadece bu aralıktaki kişileri göster Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-neutral-300 pr-2">Sadece bu aralıktaki kişileri göster</span>
            <button
              type="button"
              onClick={() => updateSettings({ strictAge: !settings.strictAge })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.strictAge ? 'bg-red-500' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.strictAge ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 7. Küresel Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <div className="font-semibold text-neutral-200">Küresel</div>
              <div className="text-[10px] text-neutral-500">Çevrendeki etkinlikler bittiğinde tüm şehri tara</div>
            </div>
            <button
              type="button"
              onClick={() => updateSettings({ isGlobal: !settings.isGlobal })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.isGlobal ? 'bg-red-500' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.isGlobal ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 8. Tercih Edilen Diller */}
          <div
            onClick={() => setLangModalOpen(!langModalOpen)}
            className="flex items-center justify-between py-2 border-t border-white/5 cursor-pointer hover:opacity-80"
          >
            <span className="font-semibold text-neutral-200">Tercih Edilen Diller</span>
            <div className="flex items-center gap-1 text-neutral-400">
              <span className="text-neutral-300 font-medium">
                {settings.preferredLanguages.join(', ')}
              </span>
              <span className="text-neutral-500 text-sm">›</span>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={closeDiscoveryModal}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            Filtreleri Uygula
          </button>
        </div>
      </div>
    </div>
  );
};
