'use client';

import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEventsStore } from '../../stores/useEventsStore';
import { useReelsStore } from '../../stores/useReelsStore';
import { useUIStore } from '../../stores/useUIStore';

export const ProfileHeader: React.FC = () => {
  const { user } = useAuthStore();
  const { events } = useEventsStore();
  const { reels } = useReelsStore();
  const { openEditProfileModal } = useUIStore();

  const userReelsCount = reels.filter((r) => r.isSelf || r.publisherId === user.id).length;
  const userEventsCount = events.filter((e) => e.hostName === user.name || e.isJoined).length;

  return (
    <div className="p-4 bg-[#141414] border-b border-white/10 flex flex-col gap-3">
      {/* Top Row: Avatar & Stats */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <img
            src={user.avatarUrl || '/assets/profile_avatar.png'}
            alt="Profil"
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border border-[#141414] text-[10px] text-white flex items-center justify-center">
            ✓
          </span>
        </div>

        <div className="flex items-center gap-6 text-center">
          <div>
            <div className="text-base font-bold text-white font-['Outfit']">{userReelsCount}</div>
            <div className="text-[10px] text-neutral-400">Paylaşım</div>
          </div>
          <div>
            <div className="text-base font-bold text-white font-['Outfit']">{userEventsCount}</div>
            <div className="text-[10px] text-neutral-400">Etkinlik</div>
          </div>
          <div>
            <div className="text-base font-bold text-white font-['Outfit']">1.4K</div>
            <div className="text-[10px] text-neutral-400">Takipçi</div>
          </div>
        </div>
      </div>

      {/* Bio Row */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white font-['Outfit']">{user.name}</h3>
          {user.isPro && (
            <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[9px] font-extrabold shadow-sm">
              PRO
            </span>
          )}
        </div>
        <div className="text-xs text-neutral-400 font-medium">{user.username}</div>
        <p className="text-xs text-neutral-300 leading-relaxed pt-1">{user.bio}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300 font-medium flex items-center gap-1">
          <span>🛡️</span> %98 Güven Skoru
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300 font-medium flex items-center gap-1">
          <span>🏆</span> Süper Organizatör
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={openEditProfileModal}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95"
        >
          Profili Düzenle
        </button>
        <button
          onClick={() => alert('⚙️ Ayarlar: Hesap, Gizlilik, Bildirimler ve Güvenlik ayarları aktiftir.')}
          className="p-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] text-neutral-300 hover:text-white border border-white/10 active:scale-95"
          title="Ayarlar"
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
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
