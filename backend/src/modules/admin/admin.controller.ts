import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/guards/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
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
}
