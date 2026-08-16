import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('presigned-url')
  async getPresignedUrl(
    @Request() req: any,
    @Body() body: { filename: string; contentType: string; category?: 'avatar' | 'event' | 'reel' },
  ) {
    const data = await this.uploadsService.getPresignedUploadUrl(
      req.user.id,
      body.filename,
      body.contentType,
      body.category,
    );
    return { success: true, data };
  }
}
