'use client';

import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const AppHeader: React.FC = () => {
  const { setCurrentTab, openNotifications, openSettingsModal, openAuthModal } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="app-header">
      <div className="brand-logo" onClick={() => setCurrentTab('home')}>
        <span className="text-xl">♾️</span>
        <span className="brand-name font-['Outfit']">Loopin</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Arama"
          onClick={() => setCurrentTab('home')}
        >
          <svg
            width="16"
            height="16"
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

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Bildirimler"
          onClick={openNotifications}
        >
          <svg
            width="16"
            height="16"
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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* Settings / Auth Profile Button */}
        {isAuthenticated && user ? (
          <button
            onClick={openSettingsModal}
            className="flex items-center gap-1.5 pl-1 pr-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
          >
            <img
              src={user.avatarUrl || '/assets/profile_avatar.png'}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover border border-indigo-400"
            />
            <span className="text-[11px] font-bold text-white max-w-[70px] truncate">
              {user.name.split(' ')[0]}
            </span>
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-sm transition-all"
          >
            Giriş Yap
          </button>
        )}
      </div>
    </header>
  );
};
