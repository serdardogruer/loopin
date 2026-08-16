'use client';

import React from 'react';
import { ReelItem } from '@loopin/types';
import { useReelsStore } from '../../stores/useReelsStore';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { reelsService } from '../../services/reels.service';
import { usersService } from '../../services/users.service';

export interface ReelCardProps {
  reel: ReelItem;
  isFirstCard?: boolean;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, isFirstCard }) => {
  const { toggleLike, toggleFollow } = useReelsStore();
  const { openCommentsDrawer, openProfileSheet } = useUIStore();
  const { user } = useAuthStore();

  const isOwnReel = reel.isSelf || (user && user.id === reel.publisherId);

  return (
    <div className="reel-card">
      {isFirstCard && (
        <div className="absolute top-3 left-0 right-0 z-20 flex items-center justify-center gap-1 text-[11px] text-white/80 select-none animate-pulse">
          <span className="text-sm">➔</span>
          <span>Yukarı kaydırarak diğer reels&apos;ları gör</span>
        </div>
      )}

      {/* Media & Ambient Visualizer */}
      <div className="w-full h-full relative">
        <img src={reel.mediaUrl} alt="Reel media" className="card-bg-img" />
      </div>
      <div className="card-bg-gradient" />

      {/* Side Actions Column */}
      <div className="side-actions-float">
        {/* Like Button */}
        <button
          className={`side-action-btn ${reel.isLiked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(reel.id);
            reelsService.toggleLike(reel.id).catch(() => {});
          }}
        >
          <div className="btn-icon-circle">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span>{reel.likeCount}</span>
        </button>

        {/* Comment Button */}
        <button
          className="side-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            alert(`💬 ${reel.publisherName} adlı kullanıcının paylaşımında ${reel.commentCount} yorum bulunmaktadır.`);
          }}
        >
          <div className="btn-icon-circle">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <span>{reel.commentCount}</span>
        </button>

        {/* Share Button */}
        <button
          className="side-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            reelsService.shareReel(reel.id).catch(() => {});
            alert(`🔗 @${reel.publisherUsername} adlı kullanıcının paylaşım bağlantısı kopyalandı ve paylaşıldı!`);
          }}
        >
          <div className="btn-icon-circle">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </div>
          <span>Paylaş</span>
        </button>
      </div>

      {/* Caption and Publisher Overlay */}
      <div className="card-content-overlay">
        <div className="reel-user-row">
          <div
            onClick={() => reel.publisherId && openProfileSheet(reel.publisherId)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={reel.publisherAvatar || '/assets/profile_avatar.png'}
              alt={reel.publisherName}
              className="reel-avatar"
            />
            <span className="reel-username flex items-center gap-1">
              {reel.publisherName}
              <span className="text-[10px] text-indigo-400">👁️</span>
            </span>
          </div>
          {!isOwnReel && (
            <button
              className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                reel.isFollowingPublisher
                  ? 'bg-white/15 text-neutral-200 border border-white/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFollow(reel.publisherId);
                usersService.toggleFollow(reel.publisherId).catch(() => {});
              }}
            >
              {reel.isFollowingPublisher ? 'Takiptesin ✓' : '+ Takip Et'}
            </button>
          )}
        </div>
        <p className="reel-caption">{reel.caption}</p>
      </div>
    </div>
  );
};
