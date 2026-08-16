'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/useChatStore';

export const ActiveChatPanel: React.FC = () => {
  const { activeChat, messages, closeChat, sendMessage, isLoadingMessages } = useChatStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeChat) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="absolute inset-0 z-30 bg-[#0A0A0A] flex flex-col animate-slide-up">
      {/* Header */}
      <div className="h-14 px-3 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={closeChat}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <img
            src={activeChat.participantAvatar || '/assets/profile_avatar.png'}
            alt={activeChat.participantName}
            className="w-9 h-9 rounded-full object-cover border border-white/10"
          />

          <div>
            <h4 className="text-sm font-bold text-white font-['Outfit'] leading-tight">
              {activeChat.participantName}
            </h4>
            <span className="text-[10px] text-emerald-400 font-medium">
              {activeChat.participantUsername}
            </span>
          </div>
        </div>

        <button
          onClick={() => alert(`📞 ${activeChat.participantName} ile sesli arama yakında aktif olacaktır!`)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {isLoadingMessages ? (
          <div className="text-center py-10 text-xs text-neutral-500">Mesajlar yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-xs text-neutral-500 italic">
            {activeChat.participantName} ile henüz bir konuşma geçmişiniz yok. İlk mesajı yazarak selam verin! 👋
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[78%] ${
                msg.senderType === 'sent' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.senderType === 'sent'
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-br-none shadow-md shadow-indigo-500/20'
                    : 'bg-[#1E1E1E] text-neutral-200 border border-white/10 rounded-bl-none'
                }`}
              >
                <span>{msg.text}</span>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    msg.senderType === 'sent' ? 'text-white/70' : 'text-neutral-500'
                  }`}
                >
                  {msg.time || 'Şimdi'}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#1A1A1A] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Mesaj yazın..."
          className="flex-1 bg-[#0A0A0A] text-white text-xs px-4 py-2.5 rounded-full border border-white/10 outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center shadow-md shadow-indigo-500/25 active:scale-95"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};
