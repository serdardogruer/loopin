import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req: any) {
    const data = await this.notificationsService.getNotifications(req.user.id);
    return { success: true, data };
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    const data = await this.notificationsService.markAsRead(id, req.user.id);
    return { success: true, data };
  }

  @Post('read-all')
  async markAllAsRead(@Request() req: any) {
    const data = await this.notificationsService.markAllAsRead(req.user.id);
    return { success: true, data };
  }
}
