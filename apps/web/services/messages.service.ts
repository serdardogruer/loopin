import { apiClient } from './api';

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantUsername: string;
  participantAvatar?: string;
  isOnline: boolean;
  lastActiveText: string;
  unreadCount: number;
  lastMessage?: {
    text: string;
    time: string;
    isUnread: boolean;
  } | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  senderType: 'sent' | 'received';
  time: string;
  createdAt: string;
  isRead: boolean;
}

export const messagesService = {
  async getConversations(): Promise<ChatConversation[]> {
    return apiClient<ChatConversation[]>('/messages/conversations', {
      method: 'GET',
    });
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    return apiClient<ChatMessage[]>(`/messages/conversations/${conversationId}`, {
      method: 'GET',
    });
  },

  async startConversation(recipientId: string): Promise<ChatConversation> {
    return apiClient<ChatConversation>('/messages/start', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    });
  },

  async sendMessage(recipientId: string, text: string, conversationId?: string): Promise<ChatMessage> {
    return apiClient<ChatMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipientId, text, conversationId }),
    });
  },
};
