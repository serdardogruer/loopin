'use client';

import React, { useState } from 'react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'credits'>('overview');

  const stats = [
    { title: 'Toplam Kullanıcı', value: '1,420', change: '+12%', color: 'from-blue-500 to-indigo-600' },
    { title: 'Aktif Etkinlikler', value: '38', change: '+5%', color: 'from-emerald-500 to-teal-600' },
    { title: 'Açık Raporlar', value: '3', change: '-2', color: 'from-rose-500 to-red-600' },
    { title: 'Dolaşımdaki Kredi', value: '28,450', change: '+850 ₺', color: 'from-amber-500 to-orange-600' },
  ];

  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Selin Kaya', email: 'selin@loopin.codapi.site', role: 'USER', isPro: true, isBanned: false, score: 98, credits: 45 },
    { id: '2', name: 'Mert Demir', email: 'mert@loopin.codapi.site', role: 'USER', isPro: false, isBanned: false, score: 95, credits: 15 },
    { id: '3', name: 'Hakan Öztürk', email: 'hakan@loopin.codapi.site', role: 'USER', isPro: false, isBanned: false, score: 90, credits: 10 },
    { id: '4', name: 'Spam User', email: 'spammer99@fakemail.com', role: 'USER', isPro: false, isBanned: true, score: 40, credits: 0 },
  ]);

  const toggleBan = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isBanned: !u.isBanned } : u))
    );
  };

  return (
    <div className="flex h-screen bg-[#0B0F19]">
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📊 Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'users' ? 'bg-indigo-600 text-white font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              👥 Kullanıcılar
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'reports' ? 'bg-indigo-600 text-white font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🛡️ Moderasyon & Raporlar
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'credits' ? 'bg-indigo-600 text-white font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              💳 Kredi & Paketler
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 text-xs text-neutral-500">
          Domain: <span className="text-neutral-300">loopin.codapi.site</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold font-['Outfit']">Yönetim Konsolu</h1>
            <p className="text-xs text-neutral-400 mt-1">Platform genel metrikleri ve moderasyon araçları</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              ● Production Canlı
            </span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#111827] border border-white/10">
              <div className="text-xs text-neutral-400 mb-1">{s.title}</div>
              <div className="text-2xl font-extrabold text-white font-['Outfit']">{s.value}</div>
              <div className="text-[11px] text-emerald-400 mt-1">{s.change} bu hafta</div>
            </div>
          ))}
        </div>

        {/* Dynamic Section */}
        {activeTab === 'overview' || activeTab === 'users' ? (
          <div className="rounded-2xl bg-[#111827] border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-sm font-['Outfit']">Kullanıcı Yönetimi</h3>
              <span className="text-xs text-neutral-400">Toplam 4 kayıt listeleniyor</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F2937] text-neutral-400">
                <tr>
                  <th className="p-3">İsim & E-posta</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3">Güven Skoru</th>
                  <th className="p-3">Kredi Bakiyesi</th>
                  <th className="p-3">Durum</th>
                  <th className="p-3 text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {u.name}
                        {u.isPro && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[9px] font-bold">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-neutral-500 text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">%{u.score}</td>
                    <td className="p-3 font-semibold text-indigo-400">{u.credits} Kredi</td>
                    <td className="p-3">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                          Askıya Alındı
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleBan(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          u.isBanned
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        }`}
                      >
                        {u.isBanned ? 'Yasağı Kaldır' : 'Askıya Al'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#111827] border border-white/10 text-center text-sm text-neutral-400">
            {activeTab === 'reports' ? '🛡️ Aktif incelenmeyi bekleyen açık rapor bulunmamaktadır.' : '💳 Kredi paketleri ve ödeme ağ geçidi yapılandırması aktiftir.'}
          </div>
        )}
      </main>
    </div>
  );
}
