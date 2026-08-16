import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UpdateProfileSchema } from '@loopin/validation';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async getProfile(@Param('username') username: string, @Request() req: any) {
    const data = await this.usersService.getProfile(username, req.user?.id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req: any, @Body() body: any) {
    const validated = UpdateProfileSchema.parse(body);
    const data = await this.usersService.updateProfile(req.user.id, validated);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async toggleFollow(@Param('id') id: string, @Request() req: any) {
    const data = await this.usersService.toggleFollow(req.user.id, id);
    return { success: true, data };
  }

  @Get(':id/followers')
  async getFollowers(@Param('id') id: string, @Request() req: any) {
    const data = await this.usersService.getFollowers(id, req.user?.id);
    return { success: true, data };
  }

  @Get(':id/following')
  async getFollowing(@Param('id') id: string, @Request() req: any) {
    const data = await this.usersService.getFollowing(id, req.user?.id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/block')
  async blockUser(@Param('id') id: string, @Request() req: any) {
    const data = await this.usersService.blockUser(req.user.id, id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unblock')
  async unblockUser(@Param('id') id: string, @Request() req: any) {
    const data = await this.usersService.unblockUser(req.user.id, id);
    return { success: true, data };
  }
}
