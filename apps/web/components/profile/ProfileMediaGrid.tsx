'use client';

import React from 'react';
import { useReelsStore } from '../../stores/useReelsStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';

export const ProfileMediaGrid: React.FC = () => {
  const { reels } = useReelsStore();
  const { user } = useAuthStore();
  const { openDetailModal } = useUIStore();

  const selfReels = user
    ? reels.filter((r) => r.isSelf || (user.id && r.publisherId === user.id))
    : [];

  if (selfReels.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-neutral-500">
        Henüz paylaşılmış bir reel bulunmuyor.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 p-3">
      {selfReels.map((reel) => (
        <div
          key={reel.id}
          onClick={() => openDetailModal('reel', reel)}
          className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 cursor-pointer group"
        >
          <img
            src={reel.mediaUrl}
            alt={reel.caption}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-xs font-bold text-white">
            <span>❤️</span> {reel.likeCount}
          </div>
        </div>
      ))}
    </div>
  );
};
