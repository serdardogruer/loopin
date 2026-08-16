'use client';

import React, { useState } from 'react';
import { EventItem } from '@loopin/types';
import { useUIStore } from '../../stores/useUIStore';

interface EventMapViewProps {
  events: EventItem[];
}

export const EventMapView: React.FC<EventMapViewProps> = ({ events }) => {
  const { openDetailModal } = useUIStore();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(events[0] || null);

  // Simulated GPS Coordinates for Istanbul Spots
  const eventCoordinates = [
    { top: '65%', left: '55%', area: 'Kadıköy Moda' },
    { top: '35%', left: '45%', area: 'Beşiktaş Çarşı' },
    { top: '48%', left: '38%', area: 'Karaköy Sahil' },
    { top: '25%', left: '60%', area: 'Bebek Parkı' },
    { top: '40%', left: '50%', area: 'Nişantaşı' },
    { top: '75%', left: '62%', area: 'Caddebostan Sahil' },
  ];

  return (
    <div className="relative w-full h-full bg-[#0B0F19] overflow-hidden flex flex-col">
      {/* Map Radar Canvas & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      {/* Stylized Simulated Map Geography Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Bosphorus Water Path */}
          <path
            d="M 120 0 Q 180 200 160 400 T 260 800"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="38"
            opacity="0.6"
          />
          <path
            d="M 120 0 Q 180 200 160 400 T 260 800"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="12"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* User Location Radar Pulse */}
      <div className="absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 animate-ping absolute -inset-0" />
        <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white shadow-lg flex items-center justify-center text-[9px] text-white font-bold relative">
          📍
        </div>
      </div>

      {/* Event Pins */}
      {events.map((evt, idx) => {
        const coord = eventCoordinates[idx % eventCoordinates.length];
        const isSelected = selectedEvent?.id === evt.id;

        return (
          <div
            key={evt.id}
            style={{ top: coord.top, left: coord.left }}
            onClick={() => setSelectedEvent(evt)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform ${
              isSelected ? 'scale-125 z-30' : 'hover:scale-110'
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-lg border backdrop-blur-md whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-white scale-110'
                    : 'bg-[#111827]/90 text-white border-white/20'
                }`}
              >
                <span>{evt.category.includes('Müzik') ? '🎸' : evt.category.includes('Kahve') ? '☕' : '🌲'}</span>
                <span className="max-w-[70px] truncate">{evt.title}</span>
              </div>
              <div className="w-2 h-2 rotate-45 bg-[#111827] -mt-1 border-r border-b border-white/20" />
            </div>
          </div>
        );
      })}

      {/* Selected Event Bottom Floating Card */}
      {selectedEvent && (
        <div className="absolute bottom-4 inset-x-4 z-40 animate-slide-up">
          <div
            onClick={() => openDetailModal('event', selectedEvent)}
            className="p-3.5 rounded-3xl bg-[#111827]/95 backdrop-blur-xl border border-indigo-500/30 text-white shadow-2xl flex items-center gap-3 cursor-pointer hover:border-indigo-500/60 transition-all"
          >
            <img
              src={selectedEvent.imageUrl || '/assets/event_concert.png'}
              alt={selectedEvent.title}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">
                  {selectedEvent.category}
                </span>
                <span className="text-[10px] text-neutral-400">1.2 km yakında</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate font-['Outfit']">
                {selectedEvent.title}
              </h4>
              <div className="text-[11px] text-neutral-300 truncate mt-0.5">
                📍 {selectedEvent.location}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
              ›
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
