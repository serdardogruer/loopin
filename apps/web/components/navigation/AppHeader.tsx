'use client';

import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNotificationsStore } from '../../stores/useNotificationsStore';
import { useDiscoveryStore } from '../../stores/useDiscoveryStore';

export const AppHeader: React.FC = () => {
  const { currentTab, setCurrentTab, openNotifications, openSettingsModal, openAuthModal } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();
  const { unreadCount } = useNotificationsStore();
  const { openFilterModal, selectedCategory, selectedAgeRange, viewMode } = useDiscoveryStore();

  const hasActiveFilters = selectedCategory !== 'Tümü' || selectedAgeRange !== 'Tüm Yaşlar' || viewMode === 'map';

  return (
    <header className="app-header">
      <div className="brand-logo" onClick={() => setCurrentTab('home')}>
        <span className="text-xl">♾️</span>
        <span className="brand-name font-['Outfit']">Loopin</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Filter Button (Only on Home Feed) */}
        {currentTab === 'home' && (
          <button
            className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
              hasActiveFilters
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Filtrele"
            onClick={openFilterModal}
            title="Etkinlik Filtreleri"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            {hasActiveFilters && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400" />
            )}
          </button>
        )}

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

        {/* Notifications with Red Count Badge */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Bildirimler"
          onClick={openNotifications}
          title="Bildirimler"
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
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 border border-[#0A0A0A] text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
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
