'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEventsStore } from '../../stores/useEventsStore';
import { useReelsStore } from '../../stores/useReelsStore';
import { useUIStore } from '../../stores/useUIStore';
import { FollowersModal } from '../modals/FollowersModal';

export const ProfileHeader: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { events } = useEventsStore();
  const { reels } = useReelsStore();
  const { openEditProfileModal, openSettingsModal, openAuthModal } = useUIStore();

  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState<'followers' | 'following'>('followers');

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 bg-[#141A29] border-b border-white/10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto">
          👤
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-['Outfit']">Henüz Giriş Yapmadınız</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Profilinizi görüntülemek, etkinlik oluşturmak ve mesajlaşmak için lütfen giriş yapın.
          </p>
        </div>
        <button
          onClick={() => openAuthModal('login')}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25"
        >
          Giriş Yap / Kayıt Ol
        </button>
      </div>
    );
  }

  const userReelsCount = reels.filter((r) => r.isSelf || (user?.id && r.publisherId === user.id)).length;
  const userEventsCount = events.filter((e) => (user?.name && e.hostName === user.name) || e.isJoined).length;

  const openFollowers = (tab: 'followers' | 'following') => {
    setFollowersModalTab(tab);
    setIsFollowersModalOpen(true);
  };

  return (
    <div className="p-5 bg-gradient-to-b from-[#141A29] to-[#0D121F] border-b border-white/10 flex flex-col gap-4">
      {/* Top Row: Avatar & Stats */}
      <div className="flex items-center justify-between gap-4">
        {/* Clickable Avatar to Edit Profile */}
        <div
          onClick={openEditProfileModal}
          className="relative cursor-pointer group"
          title="Fotoğrafı Değiştir / Profili Düzenle"
        >
          <img
            src={user.avatarUrl || '/assets/profile_avatar.png'}
            alt="Profil"
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-lg group-hover:opacity-85 transition-opacity"
          />
          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
            ✎
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#141A29] text-[9px] text-white flex items-center justify-center">
            ✓
          </span>
        </div>

        {/* Clean 3 Stat Cards */}
        <div className="flex-1 flex items-center justify-around text-center">
          <button
            onClick={() => openFollowers('followers')}
            className="p-1 hover:opacity-80 transition-opacity"
          >
            <div className="text-base font-bold text-white font-['Outfit']">Takipçiler</div>
            <div className="text-[11px] text-indigo-400 font-semibold">Bağlantılar</div>
          </button>
          <button
            onClick={() => openFollowers('following')}
            className="p-1 hover:opacity-80 transition-opacity"
          >
            <div className="text-base font-bold text-white font-['Outfit']">Takip</div>
            <div className="text-[11px] text-neutral-400 font-medium">Edilenler</div>
          </button>
          <div className="p-1">
            <div className="text-base font-bold text-amber-400 font-['Outfit'] flex items-center justify-center gap-1">
              <span>{user.creditBalance ?? 10}</span>
              <span className="text-xs">🪙</span>
            </div>
            <div className="text-[11px] text-amber-400/90 font-semibold">Kredi Bakiyesi</div>
          </div>
        </div>
      </div>

      {/* Name, Username & Bio */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">{user.name}</h2>
          {user.isPro && (
            <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[9px] font-extrabold shadow-sm">
              PRO
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            🛡️ %98 Güven Skoru
          </span>
        </div>
        <div className="text-xs text-indigo-400 font-medium">@{user.username || user.email}</div>
        <p className="text-xs text-neutral-300 leading-relaxed pt-0.5">
          {user.bio || 'Henüz bir biyografi eklenmedi. "Profili Düzenle" butonundan kendinizi tanıtabilirsiniz.'}
        </p>
      </div>

      {/* Clean Lifestyle & Interest Tags (Subtle) */}
      {((user as any)?.zodiac || (user as any)?.languages || (user as any)?.lookingFor || (user as any)?.interests?.length > 0) && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {(user as any)?.zodiac && (
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-semibold">
              🌙 {(user as any).zodiac}
            </span>
          )}
          {(user as any)?.lookingFor && (
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-300 font-semibold">
              👁️ {(user as any).lookingFor}
            </span>
          )}
          {(user as any)?.languages && (
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 font-semibold">
              🌐 {(user as any).languages}
            </span>
          )}
          {(user as any)?.interests?.slice(0, 3).map((tag: string) => (
            <span key={tag} className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-neutral-300 font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons: 1 Direct "Profili Düzenle" + 1 Clean Settings Button */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={openEditProfileModal}
          className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-1.5 transition-all"
        >
          <span>✏️</span>
          <span>Profili Düzenle</span>
        </button>

        <button
          onClick={openSettingsModal}
          className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 active:scale-95 flex items-center justify-center transition-all"
          title="Ayarlar & Çıkış"
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

      {/* Followers / Following Modal */}
      {isFollowersModalOpen && (
        <FollowersModal
          isOpen={isFollowersModalOpen}
          initialTab={followersModalTab}
          targetUserId={user.id}
          targetUsername={user.name}
          onClose={() => setIsFollowersModalOpen(false)}
        />
      )}
    </div>
  );
};
