import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/socket.io',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, string>(); // userId -> socketId

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userSocketMap.set(userId, client.id);
      this.server.emit('user:online', { userId });
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        this.server.emit('user:offline', { userId });
        break;
      }
    }
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { senderId: string; recipientId: string; text: string; conversationId?: string },
  ) {
    const message = await this.messagesService.sendMessage(
      payload.senderId,
      payload.recipientId,
      payload.text,
      payload.conversationId,
    );

    // Send back to sender
    client.emit('message:new', message);

    // Send to recipient if connected
    const recipientSocketId = this.userSocketMap.get(payload.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('message:new', {
        ...message,
        senderType: 'received',
      });
    }

    return message;
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { senderId: string; recipientId: string },
  ) {
    const recipientSocketId = this.userSocketMap.get(payload.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('typing:start', { userId: payload.senderId });
    }
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { senderId: string; recipientId: string },
  ) {
    const recipientSocketId = this.userSocketMap.get(payload.recipientId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('typing:stop', { userId: payload.senderId });
    }
  }
}
