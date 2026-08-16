'use client';

import React from 'react';
import { useChatStore } from '../../stores/useChatStore';

export const ChatList: React.FC = () => {
  const { conversations, setActiveChatId } = useChatStore();

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] p-4 overflow-y-auto">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
        <h2 className="text-xl font-bold text-white font-['Outfit']">Mesajlar</h2>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          3 Aktif
        </span>
      </div>

      <div className="space-y-2">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A1A1A] hover:bg-[#222222] border border-white/5 cursor-pointer transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img
                src={chat.participantAvatar || '/assets/profile_avatar.png'}
                alt={chat.participantName}
                className="w-12 h-12 rounded-full object-cover border border-white/10"
              />
              {chat.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#1A1A1A]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white truncate">{chat.participantName}</span>
                <span className="text-[11px] text-neutral-400">
                  {chat.lastMessage?.time || ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs truncate ${
                    chat.unreadCount > 0 ? 'text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  {chat.lastMessage?.text || 'Sohbeti başlatın...'}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
