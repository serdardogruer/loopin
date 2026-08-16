'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useDiscoveryStore } from '../../stores/useDiscoveryStore';

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, closeSettingsModal, openEditProfileModal, openAuthModal } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openDiscoveryModal, settings } = useDiscoveryStore();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [eventAlertsEnabled, setEventAlertsEnabled] = useState(true);

  if (!isSettingsModalOpen) return null;

  const handleLogout = () => {
    logout();
    closeSettingsModal();
    openAuthModal('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#141414] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeSettingsModal}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold font-['Outfit'] text-white">⚙️ Ayarlar & Tercihler</h2>
          <p className="text-xs text-neutral-400 mt-1">Hesap, keşif, bildirim ve gizlilik seçenekleri</p>
        </div>

        {isAuthenticated && user ? (
          <div className="space-y-6">
            {/* User Account Card */}
            <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl || '/assets/profile_avatar.png'}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="font-bold text-white text-xs">{user.name}</div>
                  <div className="text-[11px] text-neutral-400">@{user.username || user.email}</div>
                  <div className="text-[10px] text-indigo-400 mt-0.5 font-semibold">
                    {user.creditBalance ?? 10} Kredi Bakiyesi
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  closeSettingsModal();
                  openEditProfileModal();
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Düzenle
              </button>
            </div>

            {/* Discovery Settings Trigger */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                🧭 Keşif Tercihleri
              </div>
              <div
                onClick={() => {
                  closeSettingsModal();
                  openDiscoveryModal();
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 flex items-center justify-between cursor-pointer hover:border-indigo-500/60 transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>📍 Keşif Ayarları</span>
                    <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                      {settings.maxDistanceKm} km / {settings.minAge}-{settings.maxAge} yaş
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-300 mt-0.5">
                    Mesafe, yaş aralığı, cinsiyet ve konum filtrelerini ayarla
                  </div>
                </div>
                <span className="text-indigo-400 text-base font-bold">›</span>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                🔔 Bildirim Tercihleri
              </div>
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1A] cursor-pointer">
                  <span>Anlık Bildirimler (Push)</span>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1A] cursor-pointer">
                  <span>Yeni Mesaj Bildirimleri</span>
                  <input
                    type="checkbox"
                    checked={messagesEnabled}
                    onChange={(e) => setMessagesEnabled(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1A] cursor-pointer">
                  <span>Etkinlik & Başvuru Bildirimleri</span>
                  <input
                    type="checkbox"
                    checked={eventAlertsEnabled}
                    onChange={(e) => setEventAlertsEnabled(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                🛡️ Gizlilik & Güvenlik
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#1A1A1A] flex items-center justify-between text-neutral-300">
                  <span>Hesap Durumu</span>
                  <span className="text-emerald-400 font-semibold">● Aktif / Doğrulanmış</span>
                </div>
                <div className="p-3 rounded-xl bg-[#1A1A1A] flex items-center justify-between text-neutral-300">
                  <span>Güven Skoru</span>
                  <span className="text-amber-400 font-bold">%95 Güvenilir</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>🚪</span> Hesaptan Çıkış Yap
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="text-4xl">🔒</div>
            <p className="text-xs text-neutral-400">
              Ayarları yönetmek için lütfen önce giriş yapın veya yeni hesap oluşturun.
            </p>
            <button
              onClick={() => {
                closeSettingsModal();
                openAuthModal('login');
              }}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-500"
            >
              Giriş Yap / Kaydol
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
