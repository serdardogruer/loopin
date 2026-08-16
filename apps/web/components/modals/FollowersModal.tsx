'use client';

import React, { useState, useEffect } from 'react';
import { usersService, FollowUserItem } from '../../services/users.service';
import { useAuthStore } from '../../stores/useAuthStore';
import { useChatStore } from '../../stores/useChatStore';
import { useUIStore } from '../../stores/useUIStore';

interface FollowersModalProps {
  isOpen: boolean;
  initialTab?: 'followers' | 'following';
  targetUserId: string;
  targetUsername: string;
  onClose: () => void;
}

export const FollowersModal: React.FC<FollowersModalProps> = ({
  isOpen,
  initialTab = 'followers',
  targetUserId,
  targetUsername,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [users, setUsers] = useState<FollowUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { openChatWithUser } = useChatStore();
  const { setCurrentTab } = useUIStore();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const fetchList = async () => {
    if (!targetUserId || !isOpen) return;
    setIsLoading(true);
    try {
      if (activeTab === 'followers') {
        const data = await usersService.getFollowers(targetUserId);
        setUsers(data || []);
      } else {
        const data = await usersService.getFollowing(targetUserId);
        setUsers(data || []);
      }
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [activeTab, targetUserId, isOpen]);

  if (!isOpen) return null;

  const handleToggleFollow = async (item: FollowUserItem) => {
    if (!user) {
      alert('Lütfen önce giriş yapın');
      return;
    }

    // Optimistic toggle
    setUsers((prev) =>
      prev.map((u) => (u.id === item.id ? { ...u, isFollowing: !u.isFollowing } : u))
    );

    try {
      await usersService.toggleFollow(item.id);
    } catch (err: any) {
      alert(err.message || 'İşlem başarısız');
      fetchList();
    }
  };

  const handleStartChat = async (targetId: string) => {
    if (!user) {
      alert('Lütfen önce giriş yapın');
      return;
    }
    onClose();
    await openChatWithUser(targetId);
    setCurrentTab('messages');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#1A1A1A] border border-white/10 p-5 shadow-2xl animate-scale-up max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">{targetUsername}</h3>
            <span className="text-[11px] text-neutral-400">Bağlantılar & Topluluk</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#0A0A0A] p-1 rounded-2xl my-3 border border-white/5">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'followers'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Takipçiler
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'following'
                ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Takip Edilenler
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {isLoading ? (
            <div className="py-10 text-center text-xs text-neutral-400">Yükleniyor...</div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-500">
              {activeTab === 'followers'
                ? 'Henüz bir takipçi bulunmuyor.'
                : 'Henüz kimse takip edilmiyor.'}
            </div>
          ) : (
            users.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.avatarUrl || '/assets/profile_avatar.png'}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-neutral-400">{item.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {!item.isSelf && (
                    <>
                      {/* Message Button */}
                      <button
                        onClick={() => handleStartChat(item.id)}
                        className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center justify-center text-xs"
                        title="Mesaj Gönder"
                      >
                        💬
                      </button>

                      {/* Follow / Follow Back Button */}
                      <button
                        onClick={() => handleToggleFollow(item)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          item.isFollowing
                            ? 'bg-white/10 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 border border-white/10'
                            : activeTab === 'followers'
                            ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-indigo-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {item.isFollowing
                          ? 'Takiptesin'
                          : activeTab === 'followers'
                          ? 'Geri Takip Et'
                          : '+ Takip Et'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
