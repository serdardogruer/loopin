'use client';

import React, { useState } from 'react';
import { EventItem } from '@loopin/types';
import { useAuthStore } from '../../stores/useAuthStore';

interface TicketQrModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketQrModal: React.FC<TicketQrModalProps> = ({ event, isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1E1B4B] to-[#0F172A] border border-indigo-500/40 p-5 shadow-2xl animate-scale-up text-white flex flex-col items-center text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute top-0 inset-x-0 h-28 bg-indigo-600/30 blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center text-xs z-10"
        >
          ✕
        </button>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-2">
          🎟️ RESMİ ETKİNLİK GİRİŞ BİLETİ
        </span>

        <h3 className="text-base font-extrabold text-white font-['Outfit'] line-clamp-1">
          {event.title}
        </h3>
        <p className="text-xs text-neutral-300 mt-0.5">📅 {event.date}</p>

        {/* QR Code Container */}
        <div className="my-5 p-4 rounded-3xl bg-white text-black shadow-xl border-4 border-indigo-500/30 flex flex-col items-center">
          {/* Stylized Simulated QR Code */}
          <div className="w-40 h-40 bg-black p-2 rounded-2xl flex flex-wrap gap-1 items-center justify-center relative">
            <div className="absolute top-3 left-3 w-7 h-7 border-4 border-white bg-black flex items-center justify-center">
              <div className="w-3 h-3 bg-white" />
            </div>
            <div className="absolute top-3 right-3 w-7 h-7 border-4 border-white bg-black flex items-center justify-center">
              <div className="w-3 h-3 bg-white" />
            </div>
            <div className="absolute bottom-3 left-3 w-7 h-7 border-4 border-white bg-black flex items-center justify-center">
              <div className="w-3 h-3 bg-white" />
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow">
              ♾️
            </div>
          </div>
          <span className="text-[10px] font-mono text-neutral-600 mt-2 font-bold tracking-widest">
            TICKET-{event.id.substring(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Ticket Metadata */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs space-y-1.5 text-left mb-4">
          <div className="flex justify-between">
            <span className="text-neutral-400">Katılımcı:</span>
            <strong className="text-white">{user?.name || 'Misafir'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Konum:</span>
            <strong className="text-white truncate max-w-[170px]">{event.location}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Durum:</span>
            <span className="text-emerald-400 font-bold">
              {isCheckedIn ? 'Giriş Yapıldı ✓' : 'Onaylı & Geçerli Bilet ✅'}
            </span>
          </div>
        </div>

        {/* Check-in Simulation Action */}
        <button
          onClick={() => {
            setIsCheckedIn(true);
            alert('🎉 Bilet kapıda başarıyla okundu ve check-in tamamlandı! +10 Güven Puanı kazanıldı.');
          }}
          disabled={isCheckedIn}
          className={`w-full py-2.5 rounded-2xl text-xs font-bold shadow-lg transition-all ${
            isCheckedIn
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-indigo-500/25 active:scale-95'
          }`}
        >
          {isCheckedIn ? '✓ Check-in Tamamlandı' : '🔍 Kapıda QR Kodu Okut (Check-in)'}
        </button>
      </div>
    </div>
  );
};
