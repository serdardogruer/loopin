'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileModalOpen, closeEditProfileModal } = useUIStore();
  const { user, updateUserProfile } = useAuthStore();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username.replace(/^@/, ''));
  const [bio, setBio] = useState(user.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || '/assets/profile_avatar.png');

  if (!isEditProfileModalOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanUsername = username.trim().replace(/^@/, '');
    if (!cleanUsername.startsWith('@')) cleanUsername = '@' + cleanUsername;

    updateUserProfile({
      name: name.trim(),
      username: cleanUsername,
      bio: bio.trim(),
      avatarUrl: avatarPreview,
    });

    closeEditProfileModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeEditProfileModal}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#1A1A1A] border border-white/10 p-5 shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h3 className="text-base font-bold text-white font-['Outfit']">Profili Düzenle</h3>
          <button
            onClick={closeEditProfileModal}
            className="w-7 h-7 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Row */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-md"
              />
              <label className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <span className="text-xs">✏️</span>
              </label>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1.5">Fotoğrafı Değiştir</span>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2.5 text-xs text-white outline-none focus:border-indigo-500"
            />
            <div className="text-[10px] text-neutral-500 mt-1">
              www.loopin.app/@{username || 'kullanici'}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">İsim</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2.5 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-300">Özgeçmiş</label>
              <span className="text-[10px] text-neutral-500">{bio.length}/150</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              rows={3}
              placeholder="Kendinden bahset..."
              className="w-full rounded-xl bg-[#0A0A0A] border border-white/10 p-2.5 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={closeEditProfileModal}
              className="flex-1 py-2.5 rounded-xl bg-[#2A2A2A] text-white text-xs font-semibold"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-indigo-500/25"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
