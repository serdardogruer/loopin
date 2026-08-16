import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const userConversations = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { include: { profile: true } } },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
    });

    return userConversations.map((cp) => {
      const conv = cp.conversation;
      const otherParticipant = conv.participants.find((p) => p.userId !== userId)?.user;
      const lastMsg = conv.messages[0];

      return {
        id: conv.id,
        participantId: otherParticipant?.id || '',
        participantName: otherParticipant?.profile?.name || 'Kullanıcı',
        participantUsername: `@${otherParticipant?.profile?.username || 'user'}`,
        participantAvatar: otherParticipant?.profile?.avatarUrl,
        isOnline: true,
        lastActiveText: 'Çevrimiçi',
        unreadCount: cp.unreadCount,
        lastMessage: lastMsg
          ? {
              text: lastMsg.text,
              time: this.formatTime(lastMsg.createdAt),
              isUnread: !lastMsg.isRead && lastMsg.senderId !== userId,
            }
          : null,
      };
    });
  }

  async getMessages(conversationId: string, userId: string) {
    // Check membership
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });

    if (!participant) {
      throw new NotFoundException('Sohbet odası bulunamadı');
    }

    // Reset unread count
    await this.prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: { unreadCount: 0, lastReadAt: new Date() },
    });

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { include: { profile: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: m.sender.profile?.name || 'Kullanıcı',
      senderAvatar: m.sender.profile?.avatarUrl,
      text: m.text,
      senderType: m.senderId === userId ? 'sent' : 'received',
      time: this.formatTime(m.createdAt),
      createdAt: m.createdAt.toISOString(),
      isRead: m.isRead,
    }));
  }

  async sendMessage(senderId: string, recipientId: string, text: string, conversationId?: string) {
    let targetConvId = conversationId;

    if (!targetConvId) {
      // Find or create 1-on-1 conversation
      const existing = await this.prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            { participants: { some: { userId: senderId } } },
            { participants: { some: { userId: recipientId } } },
          ],
        },
      });

      if (existing) {
        targetConvId = existing.id;
      } else {
        const newConv = await this.prisma.conversation.create({
          data: {
            isGroup: false,
            participants: {
              createMany: {
                data: [{ userId: senderId }, { userId: recipientId }],
              },
            },
          },
        });
        targetConvId = newConv.id;
      }
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: targetConvId,
        senderId,
        text,
      },
      include: {
        sender: { include: { profile: true } },
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: targetConvId },
      data: { updatedAt: new Date() },
    });

    // Increment recipient unread count
    await this.prisma.conversationParticipant.updateMany({
      where: { conversationId: targetConvId, userId: { not: senderId } },
      data: { unreadCount: { increment: 1 } },
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.sender.profile?.name || 'Kullanıcı',
      senderAvatar: message.sender.profile?.avatarUrl,
      text: message.text,
      senderType: 'sent',
      time: this.formatTime(message.createdAt),
      createdAt: message.createdAt.toISOString(),
      isRead: false,
    };
  }

  private formatTime(date: Date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
