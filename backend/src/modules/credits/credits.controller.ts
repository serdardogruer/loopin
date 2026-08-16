import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('wallet')
  async getWallet(@Request() req: any) {
    const data = await this.creditsService.getWallet(req.user.id);
    return { success: true, data };
  }

  @Get('packages')
  async getPackages() {
    const data = await this.creditsService.getPackages();
    return { success: true, data };
  }
}
