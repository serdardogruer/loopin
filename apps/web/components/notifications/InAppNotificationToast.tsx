'use client';

import React from 'react';
import { useToastStore } from '../../stores/useToastStore';
import { useChatStore } from '../../stores/useChatStore';
import { useUIStore } from '../../stores/useUIStore';

export const InAppNotificationToast: React.FC = () => {
  const { activeToast, hideToast } = useToastStore();
  const { openChatWithUser } = useChatStore();
  const { setCurrentTab, openNotifications, openProfileSheet } = useUIStore();

  if (!activeToast) return null;

  const handleClick = async () => {
    hideToast();
    if (activeToast.actionType === 'open_chat' && activeToast.targetId) {
      await openChatWithUser(activeToast.targetId);
      setCurrentTab('messages');
    } else if (activeToast.actionType === 'open_notifications') {
      openNotifications();
    } else if (activeToast.actionType === 'open_profile' && activeToast.targetId) {
      openProfileSheet(activeToast.targetId);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="fixed top-3 inset-x-3 max-w-sm mx-auto z-50 p-3 rounded-2xl bg-[#1E293B]/95 backdrop-blur-xl border border-indigo-500/40 text-white shadow-2xl shadow-black/80 flex items-center gap-3 cursor-pointer animate-slide-down transition-transform hover:scale-[1.02]"
    >
      <div className="relative flex-shrink-0">
        <img
          src={activeToast.avatarUrl || '/assets/profile_avatar.png'}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border border-indigo-400"
        />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 border border-[#1E293B] text-[9px] flex items-center justify-center">
          {activeToast.type === 'message' ? '💬' : '🔔'}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white font-['Outfit'] truncate">
            {activeToast.title}
          </h4>
          <span className="text-[9px] text-indigo-300 font-medium">Şimdi</span>
        </div>
        <p className="text-[11px] text-neutral-300 truncate mt-0.5">{activeToast.body}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          hideToast();
        }}
        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white flex items-center justify-center text-xs"
      >
        ✕
      </button>
    </div>
  );
};
