import { create } from 'zustand';
import { ConversationItem, ChatMessage } from '@loopin/types';

interface ChatState {
  conversations: ConversationItem[];
  activeChatId: string | null;
  setConversations: (conversations: ConversationItem[]) => void;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, senderName?: string, senderAvatar?: string) => void;
  markAsRead: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeChatId: null,

  setConversations: (conversations) => set({ conversations }),

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

  sendMessage: (conversationId, text, senderName = 'Kullanıcı', senderAvatar = '/assets/profile_avatar.png') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'usr-self',
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
  },
}));
