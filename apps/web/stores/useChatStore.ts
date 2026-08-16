import { create } from 'zustand';
import { messagesService, ChatConversation, ChatMessage } from '../services/messages.service';

interface ChatState {
  conversations: ChatConversation[];
  activeChat: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  
  fetchConversations: () => Promise<void>;
  openChat: (conv: ChatConversation) => Promise<void>;
  openChatWithUser: (recipientId: string) => Promise<string | null>;
  closeChat: () => void;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeChat: null,
  messages: [],
  isLoading: false,
  isLoadingMessages: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const list = await messagesService.getConversations();
      set({ conversations: list || [] });
    } catch {
      // Keep existing
    } finally {
      set({ isLoading: false });
    }
  },

  openChat: async (conv) => {
    set({ activeChat: conv, isLoadingMessages: true });
    try {
      const msgs = await messagesService.getMessages(conv.id);
      set({ messages: msgs || [] });
    } catch {
      set({ messages: [] });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  openChatWithUser: async (recipientId) => {
    set({ isLoading: true });
    try {
      const conv = await messagesService.startConversation(recipientId);
      if (conv) {
        set({ activeChat: conv, isLoadingMessages: true });
        const msgs = await messagesService.getMessages(conv.id);
        set({ messages: msgs || [], isLoadingMessages: false });
        get().fetchConversations();
        return conv.id;
      }
      return null;
    } catch (err) {
      console.error('Failed to open chat:', err);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  closeChat: () => {
    set({ activeChat: null, messages: [] });
    get().fetchConversations();
  },

  sendMessage: async (text) => {
    const { activeChat, messages } = get();
    if (!activeChat || !text.trim()) return;

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversationId: activeChat.id,
      senderId: 'me',
      senderName: 'Ben',
      text: text.trim(),
      senderType: 'sent',
      time: 'Şimdi',
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    set({ messages: [...messages, optimisticMsg] });

    try {
      const sent = await messagesService.sendMessage(activeChat.participantId, text.trim(), activeChat.id);
      set((state) => ({
        messages: state.messages.map((m) => (m.id === tempId ? sent : m)),
      }));
      get().fetchConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  },
}));
