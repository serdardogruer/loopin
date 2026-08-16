'use client';

import React from 'react';
import { useUIStore } from '../../stores/useUIStore';

export const AppHeader: React.FC = () => {
  const { setCurrentTab } = useUIStore();

  return (
    <header className="app-header">
      <div className="brand-logo" onClick={() => setCurrentTab('home')}>
        <span className="text-xl">♾️</span>
        <span className="brand-name font-['Outfit']">Loopin</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Arama"
          onClick={() => alert('🔍 Arama ve filtreleme yakında aktif edilecektir.')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Bildirimler"
          onClick={() => alert('🔔 Bildirimler: Henüz okunmamış sistem bildiriminiz bulunmuyor.')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
        </button>
      </div>
    </header>
  );
};
