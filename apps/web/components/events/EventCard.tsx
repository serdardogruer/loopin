'use client';

import React from 'react';
import { EventItem } from '@loopin/types';
import { useEventsStore } from '../../stores/useEventsStore';
import { useUIStore } from '../../stores/useUIStore';
import { eventsService } from '../../services/events.service';

export interface EventCardProps {
  event: EventItem;
  isFirstCard?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isFirstCard }) => {
  const { toggleLike } = useEventsStore();
  const { openDetailModal, openCommentsDrawer } = useUIStore();

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicked on button or action, don't open detail lightbox
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.event-comments-preview')) {
      return;
    }
    openDetailModal('event', event);
  };

  const latestComment = event.comments && event.comments.length > 0
    ? event.comments[event.comments.length - 1]
    : null;

  return (
    <div className="event-card" onClick={handleCardClick}>
      {isFirstCard && (
        <div className="flex items-center justify-center gap-1 py-1 text-[11px] text-neutral-400 select-none animate-pulse">
          <span className="text-sm">➔</span>
          <span>Yukarı kaydırarak diğer etkinlikleri gör</span>
        </div>
      )}

      {/* Title */}
      <div className="event-card-header">
        <h2 className="event-card-title">{event.title}</h2>
      </div>

      {/* Media section with Side Actions Float on the Right */}
      <div className="event-card-media-wrapper relative">
        <img src={event.imageUrl} alt={event.title} className="event-card-img" />

        {/* Side Actions Column */}
        <div className="side-actions-float">
          {/* Host Avatar Button */}
          <button
            className="side-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              openDetailModal('event', event);
            }}
          >
            <div className="side-action-avatar-wrapper">
              <img
                src={event.hostAvatar || '/assets/profile_avatar.png'}
                alt={event.hostName}
                className="side-action-avatar"
              />
              <span className="avatar-follow-plus">+</span>
            </div>
          </button>

          {/* Like Button */}
          <button
            className={`side-action-btn ${event.isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(event.id);
              eventsService.toggleLike(event.id).catch(() => {});
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
            <span>{event.likeCount}</span>
          </button>

          {/* Comment Button */}
          <button
            className="side-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              openCommentsDrawer(event.id);
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
            <span>{event.commentCount}</span>
          </button>

          {/* Share Button */}
          <button
            className="side-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({ title: event.title, text: event.description, url: window.location.href });
              } else {
                alert(`"${event.title}" bağlantısı panoya kopyalandı!`);
              }
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
      </div>

      {/* Card Body: Description and Comments Preview */}
      <div className="event-card-body">
        <p className="event-card-desc">{event.description}</p>
        <div
          className="event-comments-preview"
          onClick={(e) => {
            e.stopPropagation();
            openCommentsDrawer(event.id);
          }}
        >
          <div className="comments-preview-header">Yorumlar ({event.commentCount})</div>
          <div className="comments-preview-body">
            {latestComment ? (
              <span>
                <strong className="text-white font-semibold">{latestComment.userName}: </strong>
                {latestComment.text}
              </span>
            ) : (
              <span className="text-neutral-500 italic">Henüz yorum yapılmamış. İlk yorumu sen yaz!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
