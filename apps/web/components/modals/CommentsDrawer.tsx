'use client';

import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useEventsStore } from '../../stores/useEventsStore';
import { useAuthStore } from '../../stores/useAuthStore';

export const CommentsDrawer: React.FC = () => {
  const { activeCommentsEventId, closeCommentsDrawer } = useUIStore();
  const { events, addComment } = useEventsStore();
  const { user } = useAuthStore();
  const [commentInput, setCommentInput] = useState('');

  if (!activeCommentsEventId) return null;

  const currentEvent = events.find((e) => e.id === activeCommentsEventId);
  const comments = currentEvent?.comments || [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentInput.trim()) return;

    const userName = user?.name || 'Kullanıcı';
    const userAvatar = user?.avatarUrl || undefined;

    addComment(activeCommentsEventId, commentInput.trim(), userName, userAvatar);
    setCommentInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={closeCommentsDrawer}
    >
      <div
        className="w-full max-w-md rounded-t-[32px] bg-[#1A1A1A] border-t border-white/10 p-5 shadow-2xl animate-slide-up max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white font-['Outfit']">
            Yorumlar ({comments.length})
          </h3>
          <button
            onClick={closeCommentsDrawer}
            className="w-7 h-7 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scrollable comments list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {comments.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 italic">
              Henüz yorum yapılmamış. İlk yorumu sen yaz!
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <img
                  src={c.userAvatar || '/assets/profile_avatar.png'}
                  alt={c.userName}
                  className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 bg-[#0A0A0A] p-2.5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate">{c.userName}</span>
                    <span className="text-[10px] text-neutral-500">
                      {typeof c.createdAt === 'string' && c.createdAt.includes('T')
                        ? new Date(c.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                        : 'Şimdi'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="pt-2 border-t border-white/10 flex items-center gap-2">
          <img
            src={user?.avatarUrl || '/assets/profile_avatar.png'}
            alt="User"
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Yorum ekle..."
            className="flex-1 bg-[#0A0A0A] text-white text-xs px-3.5 py-2 rounded-full border border-white/10 outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95"
          >
            Paylaş
          </button>
        </form>
      </div>
    </div>
  );
};
