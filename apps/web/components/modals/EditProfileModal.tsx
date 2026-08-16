'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { usersService } from '../../services/users.service';
import { compressImage } from '../../services/image';

const INTERESTS_OPTIONS = [
  '🎸 Müzik & Konser', '☕ Kahve & Sohbet', '🌲 Kamp & Doğa', '🎬 Sinema & Dizi',
  '💻 Yazılım & Teknoloji', '🎭 Tiyatro & Sahne', '🍕 Gastronomi & Yemek', '🏃 Koşu & Fitness',
  '✈️ Seyahat & Gezi', '📚 Kitap & Edebiyat', '🎨 Sanat & Sergi', '🎲 Kutu Oyunları',
  '🧘 Yoga & Meditasyon', '💃 Dans & Parti', '📸 Fotoğrafçılık', '🎾 Tenis & Padel',
];

const LOOKING_FOR_OPTIONS = [
  'Etkinlik Arkadaşı', 'Yeni Arkadaşlar & Sosyalleşme', 'Seyahat Ortağı', 'Proje & İş Birliği', 'Sadece Eğlence',
];

const ZODIAC_OPTIONS = [
  'Koç ♈', 'Boğa ♉', 'İkizler ♊', 'Yengeç ♋', 'Aslan ♌', 'Başak ♍',
  'Terazi ♎', 'Akrep ♏', 'Yay ♐', 'Oğlak ♑', 'Kova ♒', 'Balık ♓',
];

const COMMUNICATION_OPTIONS = [
  'Yüz yüze konuşmayı severim', 'Hızlı mesajlaşırım', 'Arayarak konuşmayı tercih ederim', 'Yavaş ama derin yazarım',
];

const PETS_OPTIONS = ['Kedi sever 🐱', 'Köpek sever 🐶', 'Kuş 🦜', 'Evcil hayvanım yok 🚫', 'Tüm hayvanları severim 🐾'];
const DRINKING_OPTIONS = ['Sosyal ortamlarda 🍷', 'Kullanmıyorum 🚫', 'Hafta sonları 🍻', 'Sık sık 🍸'];
const SMOKING_OPTIONS = ['Kullanmıyorum 🚫', 'Sosyal içici 🚬', 'Elektronik sigara 💨', 'Düzenli içici 🚬'];
const WORKOUT_OPTIONS = ['Her gün 🏋️', 'Haftada birkaç gün 🏃', 'Nadiren 🚶', 'Spor yapmıyorum 🛋️'];
const LOVE_LANGUAGE_OPTIONS = ['Kaliteli Zaman', 'Onaylayıcı Sözler', 'Hediyeleşme', 'Fiziksel Temas', 'Hizmet Eylemleri'];

export const EditProfileModal: React.FC = () => {
  const { isEditProfileModalOpen, closeEditProfileModal } = useUIStore();
  const { user, setUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'basic' | 'lifestyle' | 'gallery'>('basic');

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username ? user.username.replace(/^@/, '') : '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '/assets/profile_avatar.png');
  const [gallery, setGallery] = useState<string[]>((user as any)?.gallery || []);

  // Rich Lifestyle State (Matching user screenshot)
  const [lookingFor, setLookingFor] = useState((user as any)?.lookingFor || '');
  const [languages, setLanguages] = useState((user as any)?.languages || 'Türkçe, İngilizce');
  const [zodiac, setZodiac] = useState((user as any)?.zodiac || '');
  const [education, setEducation] = useState((user as any)?.education || '');
  const [occupation, setOccupation] = useState((user as any)?.occupation || '');
  const [communicationStyle, setCommunicationStyle] = useState((user as any)?.communicationStyle || '');
  const [loveLanguage, setLoveLanguage] = useState((user as any)?.loveLanguage || '');
  const [pets, setPets] = useState((user as any)?.pets || '');
  const [drinking, setDrinking] = useState((user as any)?.drinking || '');
  const [smoking, setSmoking] = useState((user as any)?.smoking || '');
  const [workout, setWorkout] = useState((user as any)?.workout || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>((user as any)?.interests || ['🎸 Müzik & Konser', '☕ Kahve & Sohbet']);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isEditProfileModalOpen) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.85);
        setAvatarPreview(compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAvatarPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddGalleryPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && gallery.length < 6) {
      try {
        const compressed = await compressImage(file, 800, 1000, 0.82);
        setGallery([...gallery, compressed]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveGalleryPhoto = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
  };

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      if (selectedInterests.length < 8) {
        setSelectedInterests([...selectedInterests, item]);
      } else {
        alert('En fazla 8 ilgi alanı seçebilirsiniz.');
      }
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
        lookingFor,
        languages,
        zodiac,
        education,
        occupation,
        communicationStyle,
        loveLanguage,
        pets,
        drinking,
        smoking,
        workout,
        gallery,
        interests: selectedInterests,
      });

      if (updatedUser) {
        setUser({ ...user, ...updatedUser });
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
        className="w-full max-w-md rounded-3xl bg-[#141A29] border border-white/10 p-5 shadow-2xl animate-scale-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">Profili Düzenle</h3>
            <span className="text-[11px] text-neutral-400">Kişisel Bilgiler & Yaşam Tarzı</span>
          </div>
          <button
            onClick={closeEditProfileModal}
            className="w-7 h-7 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* SubTab Selection */}
        <div className="flex bg-[#0A0E1A] p-1 rounded-2xl my-3 border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'basic'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Temel Bilgiler
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lifestyle')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lifestyle'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Yaşam Tarzı ✨
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Fotoğraf Galerisi ({gallery.length}/6)
          </button>
        </div>

        {errorMsg && (
          <div className="text-red-400 text-xs text-center font-medium bg-red-500/10 p-2 rounded-xl border border-red-500/20 mb-2">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-3.5">
              {/* Avatar */}
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
                <span className="text-[11px] text-neutral-400 mt-1">Ana Profil Fotoğrafını Değiştir</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Kendinizden, tutkularınızdan veya katılmak istediğiniz etkinliklerden bahsedin..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: LIFESTYLE & ATTRIBUTES (MATCHING SCREENSHOT) */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-3.5 text-xs">
              {/* Interests Selector */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>🎨 İlgi Alanları (En fazla 8)</span>
                  <span className="text-neutral-500 font-normal">{selectedInterests.length}/8 Seçildi</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#0A0E1A] rounded-xl border border-white/5">
                  {INTERESTS_OPTIONS.map((tag) => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold shadow'
                            : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {tag} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">👁️ Aradığım Şey</label>
                  <select
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Seçiniz</option>
                    {LOOKING_FOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">🌙 Burç</label>
                  <select
                    value={zodiac}
                    onChange={(e) => setZodiac(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Seçiniz</option>
                    {ZODIAC_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">🌐 Diller</label>
                  <input
                    type="text"
                    placeholder="Örn: Türkçe, İngilizce"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">💬 İletişim Tarzı</label>
                  <select
                    value={communicationStyle}
                    onChange={(e) => setCommunicationStyle(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Seçiniz</option>
                    {COMMUNICATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">🎓 Eğitim</label>
                  <input
                    type="text"
                    placeholder="Örn: İTÜ / Lisans"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">💼 Meslek</label>
                  <input
                    type="text"
                    placeholder="Örn: Yazılım Mühendisi"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">🐾 Evcil Hayvanlar</label>
                  <select
                    value={pets}
                    onChange={(e) => setPets(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Seçiniz</option>
                    {PETS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">💖 Aşk Dili</label>
                  <select
                    value={loveLanguage}
                    onChange={(e) => setLoveLanguage(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Seçiniz</option>
                    {LOVE_LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">🍷 İçki</label>
                  <select
                    value={drinking}
                    onChange={(e) => setDrinking(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Seçiniz</option>
                    {DRINKING_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">🚬 Sigara</label>
                  <select
                    value={smoking}
                    onChange={(e) => setSmoking(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Seçiniz</option>
                    {SMOKING_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1">🏃 Egzersiz</label>
                  <select
                    value={workout}
                    onChange={(e) => setWorkout(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl px-2 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Seçiniz</option>
                    {WORKOUT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 6-PHOTO GALLERY UPLOADER */}
          {activeTab === 'gallery' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">
                Profilinizde görüntülenecek fotoğrafları yükleyin. Profilinizi inceleyen kullanıcılar fotoğraflarınızı kaydırarak görebilir.
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {gallery.map((photo, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group bg-[#0A0E1A]">
                    <img src={photo} alt={`Fotoğraf ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryPhoto(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {gallery.length < 6 && (
                  <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-white/15 hover:border-indigo-500/60 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#0A0E1A]">
                    <span className="text-2xl text-indigo-400">+</span>
                    <span className="text-[10px] text-neutral-400 mt-1 font-semibold">Fotoğraf Ekle</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddGalleryPhoto}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-white/10">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
