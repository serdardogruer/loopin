'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { usersService } from '../../services/users.service';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileModalOpen, closeEditProfileModal } = useUIStore();
  const { user, updateUserProfile, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username ? user.username.replace(/^@/, '') : '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '/assets/profile_avatar.png');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    let cleanUsername = username.trim().replace(/^@/, '');

    try {
      const updatedUser = await usersService.updateProfile({
        name: name.trim(),
        username: cleanUsername,
        bio: bio.trim(),
        avatarUrl: avatarPreview,
      });

      if (updatedUser) {
        setUser(updatedUser);
      } else {
        updateUserProfile({
          name: name.trim(),
          username: `@${cleanUsername}`,
          bio: bio.trim(),
          avatarUrl: avatarPreview,
        });
      }

      closeEditProfileModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Profil güncellenemedi');
    } finally {
      setIsLoading(false);
    }
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
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 border border-white text-white flex items-center justify-center text-xs cursor-pointer shadow"
              >
                ✎
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <span className="text-[11px] text-neutral-400 mt-1">Profil Fotoğrafını Değiştir</span>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Ad Soyad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Kullanıcı Adı (@)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-neutral-500">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Biyografi</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Kendinizden bahsedin..."
            />
          </div>

          {errorMsg && (
            <div className="text-red-400 text-xs text-center font-medium bg-red-500/10 p-2 rounded-xl border border-red-500/20">
              {errorMsg}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
