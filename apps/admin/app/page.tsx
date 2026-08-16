'use client';

import React, { useState, useEffect } from 'react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl?: string;
  role: string;
  isPro: boolean;
  isBanned: boolean;
  trustScore: number;
  creditBalance: number;
  createdAt: string;
}

interface StatsData {
  totalUsers: number;
  totalEvents: number;
  totalReels: number;
  openReports: number;
  totalCreditsCirculating: number;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'credits'>('overview');
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalEvents: 0,
    totalReels: 0,
    openReports: 0,
    totalCreditsCirculating: 0,
  });

  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Credit Grant Modal
  const [creditModalUser, setCreditModalUser] = useState<UserItem | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(25);
  const [creditNote, setCreditNote] = useState('');
  const [isGranting, setIsGranting] = useState(false);
  const [grantSuccessMsg, setGrantSuccessMsg] = useState('');

  const fetchLiveAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/v1/admin/stats').then((r) => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/users').then((r) => r.json()).catch(() => ({})),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (usersRes.data?.users) {
        setUsersList(usersRes.data.users);
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAdminData();
  }, []);

  const toggleBan = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${id}/toggle-ban`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isBanned: json.data.isBanned } : u))
        );
      }
    } catch (err) {
      alert('Kullanıcı durumu güncellenemedi');
    }
  };

  const handleGrantCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditModalUser) return;
    setIsGranting(true);
    setGrantSuccessMsg('');

    try {
      const res = await fetch(`/api/v1/admin/users/${creditModalUser.id}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(creditAmount), description: creditNote }),
      });
      const json = await res.json();

      if (json.success) {
        setGrantSuccessMsg(`✅ ${creditModalUser.name} hesabına ${creditAmount} kredi başarıyla yüklendi!`);
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === creditModalUser.id ? { ...u, creditBalance: json.data.newBalance } : u
          )
        );
        fetchLiveAdminData();
        setTimeout(() => {
          setCreditModalUser(null);
          setGrantSuccessMsg('');
        }, 1500);
      } else {
        alert(json.message || 'Kredi yüklenemedi');
      }
    } catch (err: any) {
      alert(err.message || 'Hata oluştu');
    } finally {
      setIsGranting(false);
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0B0F19] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-white/10 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">♾️</span>
            <span className="font-['Outfit'] font-extrabold text-xl bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Loopin Admin
            </span>
          </div>

          <nav className="space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📊</span> Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'users'
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>👥</span> Kullanıcılar ({usersList.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'reports'
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🛡️</span> Moderasyon & Raporlar
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'credits'
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>💳</span> Kredi Havuzu
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 text-xs text-neutral-500 flex items-center justify-between">
          <span>Loopin Canlı VPS</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/10 bg-[#111827]/80 backdrop-blur-md px-6 flex items-center justify-between">
          <h1 className="text-lg font-bold font-['Outfit']">
            {activeTab === 'overview' && 'Yönetim Paneli Genel Bakış'}
            {activeTab === 'users' && 'Kullanıcı Yönetimi & Kredi Tanımlama'}
            {activeTab === 'reports' && 'Moderasyon & Bildirilen İçerikler'}
            {activeTab === 'credits' && 'Kredi İşlemleri & Finans'}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchLiveAdminData}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>🔄</span> Yenile
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
                👑
              </span>
              <div className="text-xs">
                <div className="font-bold">Admin</div>
                <div className="text-neutral-400 text-[10px]">Süper Yönetici</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20">
              <div className="text-xs text-blue-300 font-semibold mb-1">Toplam Kullanıcı</div>
              <div className="text-3xl font-extrabold font-['Outfit']">{stats.totalUsers}</div>
              <div className="text-[11px] text-neutral-400 mt-2">Kayıtlı gerçek hesaplar</div>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20">
              <div className="text-xs text-emerald-300 font-semibold mb-1">Aktif Etkinlikler</div>
              <div className="text-3xl font-extrabold font-['Outfit']">{stats.totalEvents}</div>
              <div className="text-[11px] text-neutral-400 mt-2">Canlı feed'de yayında</div>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/20">
              <div className="text-xs text-purple-300 font-semibold mb-1">Paylaşılan Reels</div>
              <div className="text-3xl font-extrabold font-['Outfit']">{stats.totalReels}</div>
              <div className="text-[11px] text-neutral-400 mt-2">Fotoğraf ve videolar</div>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-600/20 to-orange-600/10 border border-amber-500/20">
              <div className="text-xs text-amber-300 font-semibold mb-1">Dolaşımdaki Toplam Kredi</div>
              <div className="text-3xl font-extrabold font-['Outfit'] text-amber-400">
                {stats.totalCreditsCirculating} 🪙
              </div>
              <div className="text-[11px] text-neutral-400 mt-2">Kullanıcı cüzdan bakiyeleri</div>
            </div>
          </div>

          {/* USERS TABLE & ACTIONS */}
          <div className="bg-[#111827] rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold font-['Outfit']">Kullanıcılar & Kredi Bakiyeleri</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Tüm kayıtlı kullanıcıları listeleyin, anında bakiye yükleyin veya durumlarını yönetin.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Kullanıcı adı, isim veya e-posta ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A2234] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1A2234] text-neutral-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Kullanıcı</th>
                    <th className="p-3">E-posta</th>
                    <th className="p-3">Kredi Bakiyesi</th>
                    <th className="p-3">Güven Skoru</th>
                    <th className="p-3">Durum</th>
                    <th className="p-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-neutral-500 italic">
                        {isLoading ? 'Veriler yükleniyor...' : 'Kullanıcı bulunamadı.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3 flex items-center gap-2.5">
                          <img
                            src={u.avatarUrl || '/assets/profile_avatar.png'}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {u.name}
                              {u.isPro && (
                                <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                  PRO
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-400">{u.username}</div>
                          </div>
                        </td>
                        <td className="p-3 text-neutral-300">{u.email}</td>
                        <td className="p-3">
                          <span className="font-extrabold text-indigo-400 bg-indigo-500/15 px-2.5 py-1 rounded-full border border-indigo-500/20">
                            {u.creditBalance} 🪙
                          </span>
                        </td>
                        <td className="p-3 text-amber-400 font-bold">%{u.trustScore}</td>
                        <td className="p-3">
                          {u.isBanned ? (
                            <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                              Askıda / Yasaklı
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                              Aktif
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setCreditModalUser(u);
                              setCreditAmount(25);
                              setCreditNote('');
                              setGrantSuccessMsg('');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-sm shadow-indigo-600/30 active:scale-95 transition-all"
                          >
                            💳 Kredi Yükle
                          </button>
                          <button
                            onClick={() => toggleBan(u.id)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                              u.isBanned
                                ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                                : 'bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30'
                            }`}
                          >
                            {u.isBanned ? 'Yasağı Kaldır' : 'Askıya Al'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* CREDIT GRANT MODAL */}
      {creditModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#141A29] border border-white/15 p-6 shadow-2xl">
            <button
              onClick={() => setCreditModalUser(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 text-sm"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="text-base font-bold font-['Outfit']">Kullanıcıya Kredi Yükle</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                <strong className="text-white">{creditModalUser.name}</strong> ({creditModalUser.username})
              </p>
              <div className="mt-2 text-xs font-semibold text-indigo-400">
                Mevcut Bakiye: {creditModalUser.creditBalance} Kredi
              </div>
            </div>

            <form onSubmit={handleGrantCredits} className="space-y-4">
              {/* Quick Amount Buttons */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-neutral-300">
                  Yüklenecek Miktar:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCreditAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        creditAmount === amt
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-[#1A2234] border-white/10 text-neutral-300 hover:bg-white/5'
                      }`}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Özel Miktar Girin:
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  className="w-full bg-[#1A2234] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Note / Reason */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Açıklama / Yükleme Nedeni (İsteğe Bağlı):
                </label>
                <input
                  type="text"
                  placeholder="Örn: Promosyon veya Etkinlik Teşviki"
                  value={creditNote}
                  onChange={(e) => setCreditNote(e.target.value)}
                  className="w-full bg-[#1A2234] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {grantSuccessMsg && (
                <div className="text-emerald-400 text-xs text-center font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  {grantSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isGranting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {isGranting ? 'Yükleniyor...' : `+${creditAmount} Krediyi Hesaba Tanımla`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
