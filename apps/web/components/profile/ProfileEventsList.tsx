'use client';

import React from 'react';
import { useEventsStore } from '../../stores/useEventsStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';

export const ProfileEventsList: React.FC = () => {
  const { events } = useEventsStore();
  const { user } = useAuthStore();
  const { openDetailModal } = useUIStore();

  const userEvents = user
    ? events.filter((e) => (user.name && e.hostName === user.name) || e.isJoined || (user.id && e.hostId === user.id))
    : [];

  if (userEvents.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-neutral-500">
        Kayıtlı veya oluşturulan etkinliğiniz yok.
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {userEvents.map((event) => {
        const isOwner = user ? (event.hostName === user.name || event.hostId === user.id) : false;

        return (
          <div
            key={event.id}
            onClick={() => openDetailModal('event', event)}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#1A1A1A] hover:bg-[#222222] border border-white/5 cursor-pointer transition-colors"
          >
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate font-['Outfit']">
                {event.title}
              </h4>
              <div className="text-[10px] text-neutral-400 mt-0.5">{event.date}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-neutral-500 truncate">
                  📍 {event.location.split(',')[0]}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isOwner
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isOwner ? 'Kurucu' : 'Katılımcı'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
