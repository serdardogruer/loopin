'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal } = useUIStore();
  const { login, register, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (authModalMode === 'login') {
        await login({ emailOrUsername: email, password });
      } else {
        await register({ email, password, username, name });
      }
      closeAuthModal();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Bir hata oluştu, lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#141414] border border-white/10 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">♾️</div>
          <h2 className="text-xl font-bold font-['Outfit'] text-white">
            {authModalMode === 'login' ? 'Loopin’e Giriş Yap' : 'Yeni Hesap Oluştur'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {authModalMode === 'login'
              ? 'Etkinlikleri keşfetmek ve topluluğa katılmak için giriş yapın.'
              : 'Kaydolun ve hemen 10 ücretsiz kredi kazanın!'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#1F1F1F] p-1 rounded-2xl mb-5">
          <button
            onClick={() => openAuthModal('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authModalMode === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authModalMode === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Kayıt Ol (+10 Kredi)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Adınız & Soyadınız
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Selin Kaya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Kullanıcı Adı (@)
                </label>
                <input
                  type="text"
                  required
                  placeholder="selinkaya"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
              E-posta Adresi
            </label>
            <input
              type="email"
              required
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
              Şifre
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {(errorMessage || error) && (
            <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs text-center font-medium">
              {errorMessage || error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading
              ? 'İşleniyor...'
              : authModalMode === 'login'
              ? 'Giriş Yap'
              : 'Hesap Oluştur ve Başla'}
          </button>
        </form>
      </div>
    </div>
  );
};
