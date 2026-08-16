import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    const data = await this.adminService.getDashboardStats();
    return { success: true, data };
  }

  @Get('users')
  async listUsers(@Query('page') page?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const data = await this.adminService.listUsers(pageNum);
    return { success: true, data };
  }

  @Post('users/:id/toggle-ban')
  async toggleBan(@Param('id') id: string) {
    const data = await this.adminService.toggleBanUser(id);
    return { success: true, data };
  }

  @Post('users/:id/credits')
  async grantCredits(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('description') description?: string,
  ) {
    const data = await this.adminService.grantCredits(id, Number(amount), description);
    return { success: true, data };
  }
}
