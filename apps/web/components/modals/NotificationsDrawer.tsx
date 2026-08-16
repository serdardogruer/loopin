'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  isRead: boolean;
  type: 'application' | 'like' | 'message' | 'system';
}

export const NotificationsDrawer: React.FC = () => {
  const { isNotificationsOpen, closeNotifications, openAuthModal } = useUIStore();
  const { isAuthenticated } = useAuthStore();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Başvuru Onaylandı 🎉',
      body: 'Kadıköy Akustik Kahve & Canlı Müzik etkinliğine katılımınız onaylandı!',
      timeAgo: '10 dk önce',
      isRead: false,
      type: 'application',
    },
    {
      id: '2',
      title: 'Yeni Başvuru Alındı 📨',
      body: 'Mert Demir "Boğazda Gün Batımı Fotoğrafçılık" etkinliğinize katılmak istiyor.',
      timeAgo: '45 dk önce',
      isRead: false,
      type: 'application',
    },
    {
      id: '3',
      title: 'Paylaşımınız Beğenildi ❤️',
      body: 'Selin Kaya Belgrad Ormanı Doğa Yürüyüşü reel videonuzu beğendi.',
      timeAgo: '2 saat önce',
      isRead: true,
      type: 'like',
    },
    {
      id: '4',
      title: 'Hoş Geldiniz ♾️',
      body: 'Loopin V2 topluluğuna katıldığınız için 10 kredi hesabınıza tanımlandı.',
      timeAgo: 'Dün',
      isRead: true,
      type: 'system',
    },
  ]);

  if (!isNotificationsOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm h-full bg-[#111827] border-l border-white/10 flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h3 className="font-bold text-white text-sm font-['Outfit']">Bildirimler</h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Tümünü Oku
            </button>
            <button
              onClick={closeNotifications}
              className="text-neutral-400 hover:text-white p-1 text-sm ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {!isAuthenticated ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="text-3xl">🔔</div>
              <p className="text-xs text-neutral-400">
                Bildirimlerinizi görmek ve etkinlik gelişmelerini anlık takip etmek için lütfen giriş yapın.
              </p>
              <button
                onClick={() => {
                  closeNotifications();
                  openAuthModal('login');
                }}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25"
              >
                Giriş Yap / Kayıt Ol
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 text-xs text-neutral-400">
              Henüz yeni bir bildiriminiz bulunmuyor.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-colors ${
                  n.isRead
                    ? 'bg-[#1A2234] border-white/5 text-neutral-400'
                    : 'bg-[#1F293D] border-indigo-500/30 text-white shadow-sm shadow-indigo-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-bold text-xs text-white">{n.title}</div>
                  <div className="text-[10px] text-neutral-400 whitespace-nowrap">{n.timeAgo}</div>
                </div>
                <div className="text-xs text-neutral-300 leading-snug">{n.body}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
