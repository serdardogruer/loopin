'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useEventsStore } from '../../stores/useEventsStore';
import { useReelsStore } from '../../stores/useReelsStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { eventsService } from '../../services/events.service';
import { reelsService } from '../../services/reels.service';
import { EventCategory, EventPriceType } from '@loopin/types';
import { compressImage } from '../../services/image';

const EVENT_PRESETS = [
  { label: '🎸 Konser', url: '/assets/event_concert.png' },
  { label: '☕ Kahve', url: '/assets/event_coffee.png' },
  { label: '🌲 Doğa', url: '/assets/reel_nature.png' },
];

export const CreateModal: React.FC = () => {
  const { isCreateModalOpen, closeCreateModal, setCurrentTab } = useUIStore();
  const { addEvent } = useEventsStore();
  const { addReel } = useReelsStore();
  const { user } = useAuthStore();

  const [activeType, setActiveType] = useState<'reel' | 'event'>('reel');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
  const [eventPreview, setEventPreview] = useState<string | null>('/assets/event_concert.png');

  if (!isCreateModalOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isReel: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, isReel ? 720 : 800, isReel ? 1280 : 600, 0.82);
        if (isReel) setReelPreview(compressed);
        else setEventPreview(compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (isReel) setReelPreview(event.target?.result as string);
          else setEventPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleReelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await reelsService.create({
        caption: reelCaption,
        mediaUrl: reelPreview || '/assets/reel_nature.png',
        mediaType: 'IMAGE',
      });

      if (created) {
        addReel(created);
      }
      closeCreateModal();
      setCurrentTab('reels');
    } catch (err: any) {
      setErrorMsg(err.message || 'Paylaşım oluşturulamadı');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await eventsService.create({
        title: eventTitle,
        category: eventCategory,
        date: eventDate || new Date().toISOString(),
        location: eventLocation,
        maxCapacity: Number(eventCapacity),
        price: eventPrice,
        imageUrl: eventPreview || '/assets/event_concert.png',
        description: eventDesc,
      });

      if (created) {
        addEvent(created);
      }
      closeCreateModal();
      setCurrentTab('home');
    } catch (err: any) {
      setErrorMsg(err.message || 'Etkinlik oluşturulamadı (Kredi bakiyenizi kontrol edin)');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={closeCreateModal}
    >
      <div
        className="w-full max-w-md rounded-t-[32px] bg-[#1A1A1A] border-t border-white/10 p-5 shadow-2xl animate-slide-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-base font-bold text-white font-['Outfit']">Yeni İçerik Oluştur</h3>
          </div>
          <button
            onClick={closeCreateModal}
            className="w-7 h-7 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#0A0A0A] p-1 rounded-2xl my-4 border border-white/5">
          <button
            onClick={() => setActiveType('reel')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeType === 'reel'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>📷</span> Fotoğraf / Reel
          </button>
          <button
            onClick={() => setActiveType('event')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeType === 'event'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>🎉</span> Yeni Etkinlik (-5 Kredi)
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {errorMsg && (
            <div className="text-red-400 text-xs text-center font-medium bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
              {errorMsg}
            </div>
          )}

          {activeType === 'reel' ? (
            /* Reel Form */
            <form onSubmit={handleReelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Fotoğraf veya Video
                </label>
                <div className="border-2 border-dashed border-white/15 hover:border-indigo-500/60 rounded-2xl p-4 text-center cursor-pointer relative bg-[#0A0A0A]">
                  <input
                    id="reel-file-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />
                  <label htmlFor="reel-file-upload" className="cursor-pointer block">
                    {reelPreview ? (
                      <div className="relative aspect-[9/16] max-h-52 mx-auto rounded-xl overflow-hidden shadow-lg border border-white/10">
                        <img src={reelPreview} alt="Preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                          Görseli Değiştir
                        </span>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xl">
                          📷
                        </div>
                        <div className="text-xs text-white font-bold">Galeriden veya Kameradan Seç</div>
                        <div className="text-[10px] text-neutral-500">PNG, JPG, MP4 desteklenir</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Açıklama</label>
                <textarea
                  value={reelCaption}
                  onChange={(e) => setReelCaption(e.target.value)}
                  placeholder="Bu anı veya etkinliği anlatın..."
                  rows={3}
                  className="w-full bg-[#0A0A0A] text-white text-xs p-3 rounded-2xl border border-white/10 focus:border-indigo-500 outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Yükleniyor...' : 'Reel Olarak Paylaş'}
              </button>
            </form>
          ) : (
            /* Event Form */
            <form onSubmit={handleEventSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Etkinlik Başlığı
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Örn: Moda Sahilde Akustik Müzik"
                  className="w-full bg-[#0A0A0A] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Event Image Upload & Presets */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  🖼️ Etkinlik Kapak Görseli
                </label>
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-white/15 hover:border-indigo-500/60 rounded-2xl p-3 text-center cursor-pointer bg-[#0A0A0A]">
                    <input
                      id="event-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                    <label htmlFor="event-file-upload" className="cursor-pointer block">
                      {eventPreview ? (
                        <div className="relative h-28 mx-auto rounded-xl overflow-hidden shadow border border-white/10">
                          <img src={eventPreview} alt="Preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                            Fotoğrafı Değiştir ✎
                          </span>
                        </div>
                      ) : (
                        <div className="py-4 flex flex-col items-center gap-1.5">
                          <div className="text-2xl">📁</div>
                          <div className="text-xs text-white font-bold">Galeriden Fotoğraf Yükle</div>
                          <div className="text-[10px] text-neutral-500">JPG, PNG veya WebP</div>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Preset Suggestions */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400">Hazır Temalar:</span>
                    {EVENT_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEventPreview(preset.url)}
                        className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                          eventPreview === preset.url
                            ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                            : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Kategori</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                    className="w-full bg-[#0A0A0A] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                  >
                    <option value="Müzik & Konser">Müzik & Konser</option>
                    <option value="Kahve & Yemek">Kahve & Yemek</option>
                    <option value="Doğa & Spor">Doğa & Spor</option>
                    <option value="Sinema & Kültür">Sinema & Kültür</option>
                    <option value="Teknoloji & Hobi">Teknoloji & Hobi</option>
                    <option value="Gece Hayatı & Parti">Gece Hayatı & Parti</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Kontenjan</label>
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={eventCapacity}
                    onChange={(e) => setEventCapacity(Number(e.target.value))}
                    className="w-full bg-[#0A0A0A] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Tarih & Saat</label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#0A0A0A] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Ücret Tipi</label>
                  <select
                    value={eventPrice}
                    onChange={(e) => setEventPrice(e.target.value as EventPriceType)}
                    className="w-full bg-[#0A0A0A] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                  >
                    <option value="Herkes Kendi Öder">Herkes Kendi Öder</option>
                    <option value="Ücretsiz">Ücretsiz</option>
                    <option value="Etkinlik Sahibi İkram Eder">İkram Eder</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Konum</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Örn: Moda Sahil Parkı, Kadıköy"
                  className="w-full bg-[#0A0A0A] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Etkinlik Açıklaması
                </label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Etkinlik planı, buluşma detayları..."
                  rows={2}
                  className="w-full bg-[#0A0A0A] text-white text-xs p-2.5 rounded-xl border border-white/10 focus:border-indigo-500 outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Oluşturuluyor...' : 'Etkinliği Yayınla (-5 Kredi)'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
