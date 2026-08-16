import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { SendMessageSchema } from '@loopin/validation';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('conversations')
  async getConversations(@Request() req: any) {
    const data = await this.messagesService.getConversations(req.user.id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversations/:id')
  async getMessages(@Param('id') id: string, @Request() req: any) {
    const data = await this.messagesService.getMessages(id, req.user.id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('start')
  async startConversation(
    @Request() req: any,
    @Body('recipientId') recipientId: string,
  ) {
    const data = await this.messagesService.getOrCreateConversation(
      req.user.id,
      recipientId,
    );
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async sendMessage(@Request() req: any, @Body() body: any) {
    const validated = SendMessageSchema.parse(body);
    const data = await this.messagesService.sendMessage(
      req.user.id,
      validated.recipientId,
      validated.text,
      validated.conversationId,
    );
    return { success: true, data };
  }
}
