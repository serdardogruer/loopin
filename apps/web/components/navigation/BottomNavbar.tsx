'use client';

import React from 'react';
import { useUIStore, MainTab } from '../../stores/useUIStore';
import { useChatStore } from '../../stores/useChatStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const BottomNavbar: React.FC = () => {
  const { currentTab, setCurrentTab, openCreateModal } = useUIStore();
  const { conversations, setActiveChatId } = useChatStore();
  const { user } = useAuthStore();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleTabClick = (tab: MainTab) => {
    if (tab === 'messages') {
      setActiveChatId(null);
    }
    setCurrentTab(tab);
  };

  return (
    <nav className="app-navbar">
      {/* 1. Home Button */}
      <button
        className={`nav-item ${currentTab === 'home' ? 'active-nav' : ''}`}
        onClick={() => handleTabClick('home')}
        aria-label="Anasayfa"
      >
        <svg
          className="nav-icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Anasayfa</span>
      </button>

      {/* 2. Reels Button */}
      <button
        className={`nav-item ${currentTab === 'reels' ? 'active-nav' : ''}`}
        onClick={() => handleTabClick('reels')}
        aria-label="Reels"
      >
        <svg
          className="nav-icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="m10 8 6 4-6 4V8z"></path>
        </svg>
        <span>Reel</span>
      </button>

      {/* 3. Create Center Plus Button */}
      <button
        className="nav-item flex flex-col items-center"
        onClick={openCreateModal}
        aria-label="Oluştur"
      >
        <div className="nav-create-btn-circle">
          <span>+</span>
        </div>
        <span>Oluştur</span>
      </button>

      {/* 4. Messages Button */}
      <button
        className={`nav-item ${currentTab === 'messages' ? 'active-nav' : ''}`}
        onClick={() => handleTabClick('messages')}
        aria-label="Mesajlar"
      >
        <div className="relative">
          <svg
            className="nav-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold flex items-center justify-center shadow-sm">
              {unreadMessagesCount}
            </span>
          )}
        </div>
        <span>Mesajlar</span>
      </button>

      {/* 5. Profile Button */}
      <button
        className={`nav-item ${currentTab === 'profile' ? 'active-nav' : ''}`}
        onClick={() => handleTabClick('profile')}
        aria-label="Profil"
      >
        <img
          src={user?.avatarUrl || '/assets/profile_avatar.png'}
          alt="Profil"
          className="w-[22px] h-[22px] rounded-full object-cover border border-white/20"
        />
        <span>Profil</span>
      </button>
    </nav>
  );
};
