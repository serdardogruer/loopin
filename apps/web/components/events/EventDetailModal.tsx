'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useEventsStore } from '../../stores/useEventsStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useChatStore } from '../../stores/useChatStore';
import { eventsService } from '../../services/events.service';
import { EventItem, ReelItem } from '@loopin/types';

export const EventDetailModal: React.FC = () => {
  const { detailItem, closeDetailModal, setCurrentTab } = useUIStore();
  const { toggleJoin, events, setEvents } = useEventsStore();
  const { user } = useAuthStore();
  const { openChatWithUser } = useChatStore();

  const [isApplying, setIsApplying] = useState(false);
  const [applyNote, setApplyNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!detailItem) return null;

  // If item is Event
  if (detailItem.type === 'event') {
    const currentEvent =
      (events.find((e) => e.id === detailItem.data.id) as any) || (detailItem.data as any);
    const remaining = currentEvent.maxCapacity - currentEvent.currentCapacity;
    const isFull = currentEvent.isFull || remaining <= 0;
    const isJoined = currentEvent.isJoined;
    const isHost = currentEvent.isHost || (user?.id && currentEvent.hostId === user.id);
    const applicationStatus = currentEvent.applicationStatus || 'NONE';

    let capacityLabel = `${currentEvent.currentCapacity}/${currentEvent.maxCapacity} Katılımcı`;
    if (!isFull && remaining === 1)
      capacityLabel = `${currentEvent.currentCapacity}/${currentEvent.maxCapacity} — Son 1 yer!`;
    else if (!isFull && remaining <= 3)
      capacityLabel = `${currentEvent.currentCapacity}/${currentEvent.maxCapacity} — Son ${remaining} yer`;
    else if (isFull)
      capacityLabel = `${currentEvent.maxCapacity}/${currentEvent.maxCapacity} — Kontenjan Doldu`;

    const maxShow = 5;
    const shownAttendees = (currentEvent.attendees || []).slice(0, maxShow);
    const extraAttendees = (currentEvent.attendees || []).length - maxShow;

    const handleApply = async () => {
      if (!user) {
        alert('Lütfen önce giriş yapın');
        return;
      }
      setIsApplying(true);
      try {
        const res = await eventsService.apply(currentEvent.id, applyNote);
        alert(res.message || 'Başvurunuz iletildi!');
        // Refresh feed
        const updatedFeed = await eventsService.getFeed();
        setEvents(updatedFeed);
        setShowNoteInput(false);
      } catch (err: any) {
        alert(err.message || 'Başvuru yapılamadı');
      } finally {
        setIsApplying(false);
      }
    };

    const handleMessageHost = async () => {
      if (!user) {
        alert('Lütfen önce giriş yapın');
        return;
      }
      closeDetailModal();
      await openChatWithUser(currentEvent.hostId);
      setCurrentTab('messages');
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={closeDetailModal}
      >
        <div
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#1A1A1A] border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeDetailModal}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>

          <img
            src={currentEvent.imageUrl}
            alt={currentEvent.title}
            className="w-full h-44 object-cover flex-shrink-0"
          />

          <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
            <span className="inline-block self-start px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              {currentEvent.category}
            </span>

            <h3 className="text-lg font-bold text-white font-['Outfit']">{currentEvent.title}</h3>

            <div className="space-y-1.5 text-xs text-neutral-300">
              <div>📅 {currentEvent.date}</div>
              <div>📍 {currentEvent.location}</div>
              <div className="flex items-center justify-between">
                <span>👤 Organizatör: <strong className="text-white">{currentEvent.hostName}</strong></span>
                {!isHost && (
                  <button
                    onClick={handleMessageHost}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1"
                  >
                    <span>💬</span> Mesaj Yaz
                  </button>
                )}
              </div>
              <div>💳 Ücret: {currentEvent.price}</div>
              <div
                className={
                  isFull
                    ? 'text-red-400 font-semibold'
                    : remaining <= 3
                    ? 'text-amber-400 font-semibold'
                    : 'text-neutral-300'
                }
              >
                👥 {capacityLabel}
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">{currentEvent.description}</p>

            {/* Attendees Row */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs font-semibold text-neutral-400 mb-2">
                Onaylı Katılımcılar ({shownAttendees.length + (extraAttendees > 0 ? extraAttendees : 0)})
              </div>
              <div className="flex items-center">
                {shownAttendees.map((a: any, i: number) => (
                  <img
                    key={a.id || i}
                    src={a.avatarUrl || '/assets/profile_avatar.png'}
                    alt={a.name}
                    title={a.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-[#1A1A1A] -ml-2 first:ml-0"
                  />
                ))}
                {extraAttendees > 0 && (
                  <span className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#1A1A1A] -ml-2 text-[10px] font-bold flex items-center justify-center text-white">
                    +{extraAttendees}
                  </span>
                )}
              </div>
            </div>

            {/* Application Action Section */}
            <div className="pt-2 mt-auto space-y-2">
              {isHost ? (
                <div className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold text-center">
                  👑 Bu Etkinliğin Organizatörüsünüz
                </div>
              ) : isJoined ? (
                <button
                  className="w-full py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                  onClick={() => toggleJoin(currentEvent.id)}
                >
                  ✓ Katıldınız — İptal Et / Ayrıl
                </button>
              ) : applicationStatus === 'PENDING' ? (
                <div className="w-full py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-pulse">
                  <span>⏳</span> Katılım İsteğiniz Onay Bekliyor
                </div>
              ) : isFull ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-white/10 text-neutral-500 text-xs font-bold cursor-not-allowed"
                >
                  Kontenjan Doldu
                </button>
              ) : showNoteInput ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Organizatöre kısa bir not yazın (isteğe bağlı)..."
                    value={applyNote}
                    onChange={(e) => setApplyNote(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowNoteInput(false)}
                      className="px-3 py-2 rounded-xl bg-white/10 text-neutral-400 text-xs font-bold"
                    >
                      Vazgeç
                    </button>
                    <button
                      onClick={handleApply}
                      disabled={isApplying}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow active:scale-95 disabled:opacity-50"
                    >
                      {isApplying ? 'İletiliyor...' : 'Katılım Talebi Gönder 🎟️'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity"
                  onClick={() => setShowNoteInput(true)}
                >
                  🎟️ Etkinliğe Katılım Başvurusu Yap
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If item is Reel
  const currentReel = detailItem.data as ReelItem;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeDetailModal}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#1A1A1A] border border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeDetailModal}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center text-sm"
        >
          ✕
        </button>

        <img
          src={currentReel.mediaUrl}
          alt="Reel"
          className="w-full h-80 object-cover flex-shrink-0"
        />

        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src={currentReel.publisherAvatar || '/assets/profile_avatar.png'}
              alt={currentReel.publisherName}
              className="w-7 h-7 rounded-full object-cover border border-white/20"
            />
            <span className="text-xs font-bold text-white">{currentReel.publisherName}</span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">{currentReel.caption}</p>

          <div className="flex items-center gap-4 pt-2 border-t border-white/10 text-xs text-neutral-400">
            <span>❤️ {currentReel.likeCount} Beğeni</span>
            <span>💬 {currentReel.commentCount} Yorum</span>
          </div>
        </div>
      </div>
    </div>
  );
};
