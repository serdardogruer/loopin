'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useEventsStore } from '../../stores/useEventsStore';
import { useReelsStore } from '../../stores/useReelsStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { EventCategory, EventPriceType } from '@loopin/types';

export const CreateModal: React.FC = () => {
  const { isCreateModalOpen, closeCreateModal, setCurrentTab } = useUIStore();
  const { addEvent } = useEventsStore();
  const { addReel } = useReelsStore();
  const { user } = useAuthStore();

  const [activeType, setActiveType] = useState<'reel' | 'event'>('reel');

  // Reel Form State
  const [reelCaption, setReelCaption] = useState('');
  const [reelPreview, setReelPreview] = useState<string | null>(null);

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<EventCategory>('Müzik & Konser');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCapacity, setEventCapacity] = useState(10);
  const [eventPrice, setEventPrice] = useState<EventPriceType>('Herkes Kendi Öder');
  const [eventDesc, setEventDesc] = useState('');
  const [eventPreview, setEventPreview] = useState<string | null>(null);

  if (!isCreateModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isReel: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (isReel) setReelPreview(event.target?.result as string);
        else setEventPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const publisherId = user?.id || `usr-${Date.now()}`;
    const publisherName = user?.name || 'Kullanıcı';
    const publisherUsername = user?.username || '@kullanici';
    const publisherAvatar = user?.avatarUrl || '/assets/profile_avatar.png';

    addReel({
      id: `reel-${Date.now()}`,
      publisherId,
      publisherName,
      publisherUsername,
      publisherAvatar,
      caption: reelCaption,
      mediaUrl: reelPreview || '/assets/reel_nature.png',
      mediaType: 'IMAGE',
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      isSelf: true,
      createdAt: new Date().toISOString(),
    });

    closeCreateModal();
    setCurrentTab('reels');
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedDate = 'Yakında';
    if (eventDate) {
      const d = new Date(eventDate);
      const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      formattedDate = `${d.getDate()} ${months[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    const hostId = user?.id || `usr-${Date.now()}`;
    const hostName = user?.name || 'Kullanıcı';
    const hostUsername = user?.username || '@kullanici';
    const hostAvatar = user?.avatarUrl || '/assets/profile_avatar.png';

    addEvent({
      id: `evt-${Date.now()}`,
      title: eventTitle,
      category: eventCategory,
      date: formattedDate,
      rawDate: eventDate,
      location: eventLocation,
      maxCapacity: eventCapacity,
      currentCapacity: 1,
      isFull: false,
      price: eventPrice,
      imageUrl: eventPreview || '/assets/event_concert.png',
      description: eventDesc,
      hostId,
      hostName,
      hostUsername,
      hostAvatar,
      hostTrustScore: '%100 Güven Skoru',
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      isJoined: true,
      attendees: [
        {
          id: `att-${Date.now()}`,
          userId: hostId,
          name: hostName,
          username: hostUsername,
          avatarUrl: hostAvatar,
          joinedAt: new Date().toISOString(),
        },
      ],
      comments: [],
      createdAt: new Date().toISOString(),
    });

    closeCreateModal();
    setCurrentTab('home');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={closeCreateModal}
    >
      <div
        className="w-full max-w-md rounded-t-[32px] bg-[#1A1A1A] border-t border-white/10 p-5 shadow-2xl animate-slide-up max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white font-['Outfit']">Yeni Paylaşım Oluştur</h3>
          <button
            onClick={closeCreateModal}
            className="w-7 h-7 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-2 my-3 p-1 rounded-2xl bg-[#0A0A0A] border border-white/5">
          <button
            onClick={() => setActiveType('reel')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeType === 'reel'
                ? 'bg-[#2A2A2A] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            📷 Reel (Fotoğraf / Video)
          </button>
          <button
            onClick={() => setActiveType('event')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeType === 'event'
                ? 'bg-[#2A2A2A] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🎉 Etkinlik
          </button>
        </div>

        {/* Form Container */}
        <div className="overflow-y-auto flex-1 pr-1">
          {activeType === 'reel' ? (
            <form onSubmit={handleReelSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Medya Seçin
                </label>
                <label className="flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 cursor-pointer hover:border-indigo-500/50 transition-colors relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, true)}
                  />
                  {reelPreview ? (
                    <img src={reelPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-3">
                      <div className="text-2xl mb-1">📤</div>
                      <div className="text-xs font-semibold text-white">Görsel / Video Yükle</div>
                      <div className="text-[10px] text-neutral-400">JPG, PNG, MP4</div>
                    </div>
                  )}
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Açıklama</label>
                <textarea
                  value={reelCaption}
                  onChange={(e) => setReelCaption(e.target.value)}
                  placeholder="Reel hakkında bir şeyler yazın..."
                  rows={3}
                  required
                  className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-3 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 py-2.5 rounded-xl bg-[#2A2A2A] text-white text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-indigo-500/25"
                >
                  Reel&apos;de Paylaş
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleEventSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Kapak Görseli
                </label>
                <label className="flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 cursor-pointer hover:border-indigo-500/50 transition-colors relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, false)}
                  />
                  {eventPreview ? (
                    <img src={eventPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-xl mb-1">🖼️</div>
                      <div className="text-xs font-semibold text-white">Kapak Resmi Seç</div>
                    </div>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Etkinlik Başlığı
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Örn: Konser, Kahve vb."
                    className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                    className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Müzik & Konser">🎵 Müzik & Konser</option>
                    <option value="Kahve & Yemek">☕ Kahve & Yemek</option>
                    <option value="Doğa & Spor">🌲 Doğa & Spor</option>
                    <option value="Sinema & Kültür">🎬 Sinema & Kültür</option>
                    <option value="Teknoloji & Hobi">💻 Teknoloji & Hobi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Tarih & Saat
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Mekan / Konum
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Örn: Kadıköy Moda"
                    className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Kontenjan (Kişi)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={eventCapacity}
                    onChange={(e) => setEventCapacity(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Bütçe / Ücret
                  </label>
                  <select
                    value={eventPrice}
                    onChange={(e) => setEventPrice(e.target.value as EventPriceType)}
                    className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Herkes Kendi Öder">Herkes Kendi Öder</option>
                    <option value="Ücretsiz">Ücretsiz</option>
                    <option value="Etkinlik Sahibi İkram Eder">Organizatör Öder</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Açıklama & Buluşma Notları
                </label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  rows={2}
                  required
                  placeholder="Etkinlik detayları..."
                  className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center justify-between">
                <span>💳 Etkinlik oluşturma maliyeti:</span>
                <span className="font-bold">5 Kredi</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 py-2.5 rounded-xl bg-[#2A2A2A] text-white text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-indigo-500/25"
                >
                  Ana Sayfada Paylaş
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
