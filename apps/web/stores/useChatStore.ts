import { create } from 'zustand';
import { ConversationItem, ChatMessage } from '@loopin/types';
import { initialMockChats } from '../mock';

interface ChatState {
  conversations: ConversationItem[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, senderName?: string, senderAvatar?: string) => void;
  markAsRead: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: initialMockChats,
  activeChatId: null,

  setActiveChatId: (id) => {
    set({ activeChatId: id });
    if (id) {
      get().markAsRead(id);
    }
  },

  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            unreadCount: 0,
            lastMessage: c.lastMessage ? { ...c.lastMessage, isUnread: false } : null,
          };
        }
        return c;
      }),
    })),

  sendMessage: (conversationId, text, senderName = 'Selin Kaya', senderAvatar = '/assets/profile_avatar.png') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'usr-1',
      senderName,
      senderAvatar,
      text,
      senderType: 'sent',
      createdAt: now.toISOString(),
      isRead: true,
    };

    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: {
              text,
              time: timeStr,
              isUnread: false,
            },
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      }),
    }));

    // Simulate automatic reply after 1.5 seconds if active
    setTimeout(() => {
      const replies = [
        'Harika! O zaman planı netleştirelim.',
        'Aynen öyle, katılıyorum. 👍',
        'Süper, detayları grupta da konuşuruz.',
        'Bana uyar, o gün görüşmek üzere!',
        'Harika bir fikir bu arada, sabırsızlanıyorum!',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        conversationId,
        senderId: 'usr-partner',
        senderName: 'Sohbet Arkadaşı',
        senderAvatar: '/assets/profile_avatar.png',
        text: randomReply,
        senderType: 'received',
        createdAt: new Date().toISOString(),
        isRead: get().activeChatId === conversationId,
      };

      set((state) => ({
        conversations: state.conversations.map((c) => {
          if (c.id === conversationId) {
            const isCurrentlyOpen = get().activeChatId === conversationId;
            return {
              ...c,
              unreadCount: isCurrentlyOpen ? 0 : c.unreadCount + 1,
              lastMessage: {
                text: randomReply,
                time: replyTime,
                isUnread: !isCurrentlyOpen,
              },
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        }),
      }));
    }, 1500);
  },
}));
