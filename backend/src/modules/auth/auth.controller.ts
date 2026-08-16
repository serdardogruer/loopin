import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RegisterSchema, LoginSchema } from '@loopin/validation';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const validated = RegisterSchema.parse(body);
    const data = await this.authService.register(validated);
    return { success: true, data };
  }

  @Post('login')
  async login(@Body() body: any) {
    const validated = LoginSchema.parse(body);
    const data = await this.authService.login(validated);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    const data = await this.authService.me(req.user.id);
    return { success: true, data };
  }
}
