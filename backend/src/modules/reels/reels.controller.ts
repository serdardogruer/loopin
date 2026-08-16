import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReelsService } from './reels.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../core/guards/optional-jwt-auth.guard';
import { CreateReelSchema, CreateCommentSchema } from '@loopin/validation';

@Controller('reels')
export class ReelsController {
  constructor(private readonly reelsService: ReelsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('feed')
  async getFeed(@Request() req: any) {
    const userId = req.user?.id;
    const data = await this.reelsService.getFeed(userId);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() body: any) {
    const validated = CreateReelSchema.parse(body);
    const data = await this.reelsService.create(req.user.id, validated);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Request() req: any) {
    const data = await this.reelsService.toggleLike(id, req.user.id);
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
    const data = await this.reelsService.addComment(
      id,
      req.user.id,
      validated.text,
    );
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/share')
  async shareReel(@Param('id') id: string, @Request() req: any) {
    const data = await this.reelsService.shareReel(id, req.user.id);
    return { success: true, data };
  }
}
