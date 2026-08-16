import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CreateEventSchema, CreateCommentSchema } from '@loopin/validation';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('feed')
  async getFeed(@Request() req: any) {
    const userId = req.user?.id;
    const data = await this.eventsService.getFeed(userId);
    return { success: true, data };
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    const data = await this.eventsService.getById(id, userId);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() body: any) {
    const validated = CreateEventSchema.parse(body);
    const data = await this.eventsService.create(req.user.id, validated);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Request() req: any) {
    const data = await this.eventsService.toggleLike(id, req.user.id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async toggleJoin(@Param('id') id: string, @Request() req: any) {
    const data = await this.eventsService.toggleJoin(id, req.user.id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    const validated = CreateCommentSchema.parse(body);
    const data = await this.eventsService.addComment(
      id,
      req.user.id,
      validated.text,
    );
    return { success: true, data };
  }
}
