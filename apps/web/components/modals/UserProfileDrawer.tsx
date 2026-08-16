'use client';

import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useChatStore } from '../../stores/useChatStore';
import { useEventsStore } from '../../stores/useEventsStore';
import { usersService, DetailedUserProfile } from '../../services/users.service';
import { eventsService } from '../../services/events.service';

export const UserProfileDrawer: React.FC = () => {
  const { activeProfileUserId, closeProfileSheet, setCurrentTab, openDetailModal } = useUIStore();
  const { user } = useAuthStore();
  const { openChatWithUser } = useChatStore();
  const { setEvents } = useEventsStore();

  const [profile, setProfile] = useState<DetailedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'about' | 'events' | 'reels'>('about');
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    if (activeProfileUserId) {
      setIsLoading(true);
      setActivePhotoIdx(0);
      setActiveSubTab('about');
      usersService
        .getProfile(activeProfileUserId)
        .then((data) => setProfile(data))
        .catch((err) => console.error('Profile fetch error:', err))
        .finally(() => setIsLoading(false));
    }
  }, [activeProfileUserId]);

  if (!activeProfileUserId) return null;

  const allPhotos = profile
    ? [profile.avatarUrl || '/assets/profile_avatar.png', ...(profile.gallery || [])].filter(Boolean)
    : [];

  const isOwnProfile = profile ? (profile.isSelf || (user ? user.id === profile.id : false)) : false;

  const handleToggleFollow = async () => {
    if (!user || !profile) {
      alert('Lütfen önce giriş yapın');
      return;
    }
    const nextState = !profile.isFollowing;
    setProfile({ ...profile, isFollowing: nextState });

    try {
      await usersService.toggleFollow(profile.id);
    } catch {
      setProfile({ ...profile, isFollowing: !nextState });
    }
  };

  const handleStartChat = async () => {
    if (!user || !profile) {
      alert('Lütfen önce giriş yapın');
      return;
    }
    closeProfileSheet();
    await openChatWithUser(profile.id);
    setCurrentTab('messages');
  };

  const handleToggleBlock = async () => {
    if (!user || !profile) return;
    if (profile.isBlocked) {
      await usersService.unblockUser(profile.id);
      setProfile({ ...profile, isBlocked: false });
      alert('Kullanıcı engeli kaldırıldı');
    } else {
      if (confirm(`${profile.name} adlı kullanıcıyı engellemek istediğinize emin misiniz? Artık birbirinizi göremez ve mesajlaşamazsınız.`)) {
        setIsBlocking(true);
        await usersService.blockUser(profile.id);
        setProfile({ ...profile, isBlocked: true });
        // Refresh events feed
        const updatedFeed = await eventsService.getFeed();
        setEvents(updatedFeed);
        setIsBlocking(false);
        closeProfileSheet();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeProfileSheet}
    >
      <div
        className="w-full max-w-md h-full bg-[#111827] border-l border-white/10 flex flex-col shadow-2xl animate-slide-left overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <button
            onClick={closeProfileSheet}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center text-sm shadow"
          >
            ✕
          </button>
          {profile && !profile.isSelf && (
            <button
              onClick={handleToggleBlock}
              disabled={isBlocking}
              className="px-3 py-1 rounded-full bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 text-red-300 text-[11px] font-bold backdrop-blur-md"
            >
              {profile.isBlocked ? 'Engeli Kaldır' : '🚫 Engelle'}
            </button>
          )}
        </div>

        {isLoading || !profile ? (
          <div className="flex-1 flex items-center justify-center text-xs text-neutral-400">
            Profil bilgileri yükleniyor...
          </div>
        ) : (
          <div className="space-y-4 pb-20 -mt-16">
            {/* Photo Gallery Carousel */}
            <div className="relative aspect-[3/4] w-full bg-[#0A0A0A] overflow-hidden">
              <img
                src={allPhotos[activePhotoIdx] || '/assets/profile_avatar.png'}
                alt={profile.name}
                className="w-full h-full object-cover"
              />

              {/* Photo Indicator Bars */}
              {allPhotos.length > 1 && (
                <div className="absolute top-16 left-3 right-3 flex gap-1 z-10">
                  {allPhotos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        idx === activePhotoIdx ? 'bg-white shadow' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Touch Next/Prev areas */}
              {allPhotos.length > 1 && (
                <>
                  <div
                    className="absolute left-0 top-20 bottom-0 w-1/2 cursor-pointer"
                    onClick={() =>
                      setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))
                    }
                  />
                  <div
                    className="absolute right-0 top-20 bottom-0 w-1/2 cursor-pointer"
                    onClick={() =>
                      setActivePhotoIdx((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))
                    }
                  />
                </>
              )}

              {/* Name & Basic Info Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white font-['Outfit']">{profile.name}</h2>
                  {profile.isPro && (
                    <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[9px] font-extrabold">
                      PRO
                    </span>
                  )}
                </div>
                <div className="text-xs text-indigo-400 font-semibold">{profile.username}</div>
                {profile.city && (
                  <div className="text-[11px] text-neutral-300 mt-1 flex items-center gap-1">
                    <span>📍</span> {profile.city} {profile.district ? `(${profile.district})` : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Action Bar */}
            {!isOwnProfile && (
              <div className="px-5 flex items-center gap-2">
                <button
                  onClick={handleToggleFollow}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all shadow ${
                    profile.isFollowing
                      ? 'bg-white/10 text-neutral-300 border border-white/10 hover:bg-red-500/20 hover:text-red-400'
                      : 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-indigo-500/25'
                  }`}
                >
                  {profile.isFollowing ? 'Takiptesin ✓' : '+ Takip Et'}
                </button>
                <button
                  onClick={handleStartChat}
                  className="flex-1 py-2.5 rounded-2xl bg-[#1E293B] hover:bg-[#2A374F] text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 shadow"
                >
                  <span>💬</span> Mesaj Gönder
                </button>
              </div>
            )}

            {/* SubTab Selection */}
            <div className="px-5">
              <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/5">
                <button
                  onClick={() => setActiveSubTab('about')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSubTab === 'about'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Hakkında
                </button>
                <button
                  onClick={() => setActiveSubTab('events')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSubTab === 'events'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Etkinlikler ({profile.events?.length || 0})
                </button>
                <button
                  onClick={() => setActiveSubTab('reels')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSubTab === 'reels'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Paylaşımlar ({profile.reels?.length || 0})
                </button>
              </div>
            </div>

            {/* Tab: ABOUT & LIFESTYLE ATTRIBUTES */}
            {activeSubTab === 'about' && (
              <div className="px-5 space-y-4">
                {/* Trust Score & Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <span>🛡️</span> {profile.trustScore || '%98 Güven Skoru'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <span>🏆</span> {profile.badgeTitle || 'Süper Organizatör'}
                  </span>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-1">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Biyografi
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Rich Lifestyle Grid (Matching screenshot attributes) */}
                <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-3">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Yaşam Tarzı & Nitelikler
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {profile.zodiac && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">🌙</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">Burç</div>
                          <div className="font-bold text-white">{profile.zodiac}</div>
                        </div>
                      </div>
                    )}

                    {profile.languages && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">🌐</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">Diller</div>
                          <div className="font-bold text-white">{profile.languages}</div>
                        </div>
                      </div>
                    )}

                    {profile.lookingFor && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">👁️</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">Aradığım Şey</div>
                          <div className="font-bold text-white">{profile.lookingFor}</div>
                        </div>
                      </div>
                    )}

                    {profile.education && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">🎓</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">Eğitim</div>
                          <div className="font-bold text-white">{profile.education}</div>
                        </div>
                      </div>
                    )}

                    {profile.occupation && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">💼</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">Meslek</div>
                          <div className="font-bold text-white">{profile.occupation}</div>
                        </div>
                      </div>
                    )}

                    {profile.communicationStyle && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">💬</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">İletişim Tarzı</div>
                          <div className="font-bold text-white">{profile.communicationStyle}</div>
                        </div>
                      </div>
                    )}

                    {profile.pets && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">🐾</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">Evcil Hayvanlar</div>
                          <div className="font-bold text-white">{profile.pets}</div>
                        </div>
                      </div>
                    )}

                    {profile.drinking && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">🍷</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">İçki</div>
                          <div className="font-bold text-white">{profile.drinking}</div>
                        </div>
                      </div>
                    )}

                    {profile.smoking && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">🚬</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">Sigara</div>
                          <div className="font-bold text-white">{profile.smoking}</div>
                        </div>
                      </div>
                    )}

                    {profile.workout && (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <span className="text-base">🏃</span>
                        <div>
                          <div className="text-[10px] text-neutral-400">Egzersiz</div>
                          <div className="font-bold text-white">{profile.workout}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interests Chips */}
                {profile.interests && profile.interests.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-2">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      İlgi Alanları
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.interests.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: EVENTS */}
            {activeSubTab === 'events' && (
              <div className="px-5 space-y-2.5">
                {profile.events?.length === 0 ? (
                  <div className="py-10 text-center text-xs text-neutral-500">
                    Henüz oluşturulmuş bir etkinlik bulunmuyor.
                  </div>
                ) : (
                  profile.events?.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => openDetailModal('event', evt as any)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/15 cursor-pointer transition-all"
                    >
                      <img
                        src={evt.imageUrl || '/assets/event_concert.png'}
                        alt={evt.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{evt.title}</h4>
                        <div className="text-[11px] text-neutral-400 mt-0.5">📅 {evt.date}</div>
                        <div className="text-[11px] text-indigo-400 mt-0.5 font-semibold truncate">
                          📍 {evt.location}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: REELS */}
            {activeSubTab === 'reels' && (
              <div className="px-5 grid grid-cols-3 gap-2">
                {profile.reels?.length === 0 ? (
                  <div className="col-span-3 py-10 text-center text-xs text-neutral-500">
                    Henüz paylaşılmış bir fotoğraf veya video yok.
                  </div>
                ) : (
                  profile.reels?.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => openDetailModal('reel', r as any)}
                      className="aspect-[9/16] rounded-xl overflow-hidden relative cursor-pointer group bg-[#0A0A0A]"
                    >
                      <img src={r.imageUrl} alt="Reel" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        ❤️ {r.likeCount}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
