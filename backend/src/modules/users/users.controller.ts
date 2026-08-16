import {
  Controller,
  Get,
  Put,
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
}
