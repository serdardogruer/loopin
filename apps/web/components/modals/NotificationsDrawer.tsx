'use client';

import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNotificationsStore } from '../../stores/useNotificationsStore';
import { usersService } from '../../services/users.service';

export const NotificationsDrawer: React.FC = () => {
  const { isNotificationsOpen, closeNotifications, openAuthModal } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    approveApplication,
    rejectApplication,
  } = useNotificationsStore();

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isNotificationsOpen && isAuthenticated) {
      fetchNotifications();
    }
  }, [isNotificationsOpen, isAuthenticated]);

  if (!isNotificationsOpen) return null;

  const handleApprove = async (applicationId: string, notificationId: string) => {
    setActionLoadingId(notificationId);
    await approveApplication(applicationId, notificationId);
    setActionLoadingId(null);
  };

  const handleReject = async (applicationId: string, notificationId: string) => {
    setActionLoadingId(notificationId);
    await rejectApplication(applicationId, notificationId);
    setActionLoadingId(null);
  };

  const handleFollowBack = async (targetId: string, notificationId: string) => {
    try {
      await usersService.toggleFollow(targetId);
      markAsRead(notificationId);
      alert('Kullanıcıyı geri takip ettiniz! ✨');
    } catch (err: any) {
      alert(err.message || 'İşlem başarısız');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm h-full bg-[#111827] border-l border-white/10 flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h3 className="font-bold text-white text-sm font-['Outfit']">Bildirimler</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Tümünü Oku
              </button>
            )}
            <button
              onClick={closeNotifications}
              className="text-neutral-400 hover:text-white p-1 text-sm ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {!isAuthenticated ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="text-3xl">🔔</div>
              <p className="text-xs text-neutral-400">
                Bildirimlerinizi görmek ve etkinlik gelişmelerini anlık takip etmek için lütfen giriş yapın.
              </p>
              <button
                onClick={() => {
                  closeNotifications();
                  openAuthModal('login');
                }}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25"
              >
                Giriş Yap / Kayıt Ol
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 text-xs text-neutral-400">
              Henüz yeni bir bildiriminiz bulunmuyor.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-colors ${
                  n.isRead
                    ? 'bg-[#1A2234] border-white/5 text-neutral-400'
                    : 'bg-[#1F293D] border-indigo-500/30 text-white shadow-sm shadow-indigo-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div
                    onClick={(e) => {
                      const targetUserId = n.data?.applicantId || n.data?.followerId || n.data?.likerId;
                      if (targetUserId) {
                        e.stopPropagation();
                        closeNotifications();
                        useUIStore.getState().openProfileSheet(targetUserId);
                      }
                    }}
                    className="font-bold text-xs text-white hover:text-indigo-300 cursor-pointer flex items-center gap-1"
                  >
                    <span>{n.title}</span>
                    {(n.data?.applicantId || n.data?.followerId) && (
                      <span className="text-[10px] text-indigo-400">👁️</span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="text-xs text-neutral-300 leading-snug">{n.body}</div>

                {/* Application Approval Actions */}
                {n.type === 'APPLICATION_RECEIVED' && n.data?.applicationId && (
                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(n.data!.applicationId!, n.id);
                      }}
                      disabled={actionLoadingId === n.id}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow active:scale-95 disabled:opacity-50"
                    >
                      Onayla ✅
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(n.data!.applicationId!, n.id);
                      }}
                      disabled={actionLoadingId === n.id}
                      className="flex-1 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 text-[11px] font-bold shadow active:scale-95 disabled:opacity-50"
                    >
                      Reddet ❌
                    </button>
                  </div>
                )}

                {/* Follow Back Action */}
                {n.type === 'NEW_FOLLOWER' && n.data?.followerId && (
                  <div className="mt-3 pt-2 border-t border-white/10 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowBack(n.data!.followerId!, n.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[11px] font-bold shadow active:scale-95"
                    >
                      Geri Takip Et ✨
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
