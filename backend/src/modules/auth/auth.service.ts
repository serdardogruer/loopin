import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RegisterInput, LoginInput } from '@loopin/validation';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterInput) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingEmail) {
      throw new ConflictException('Bu e-posta adresi zaten kullanımda');
    }

    const cleanUsername = dto.username.toLowerCase().replace(/^@/, '');
    const existingUsername = await this.prisma.profile.findUnique({
      where: { username: cleanUsername },
    });
    if (existingUsername) {
      throw new ConflictException('Bu kullanıcı adı zaten alınmış');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        passwordHash,
        profile: {
          create: {
            name: dto.name,
            username: cleanUsername,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            trustScore: 95,
          },
        },
        creditWallet: {
          create: {
            balance: 10, // Default 10 credits for new user
            transactions: {
              create: {
                amount: 10,
                balanceAfter: 10,
                type: 'INITIAL_GRANT',
                description: 'Hoş geldin hediyesi (10 Kredi)',
              },
            },
          },
        },
      },
      include: {
        profile: true,
        creditWallet: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.formatUser(user),
      tokens,
    };
  }

  async login(dto: LoginInput) {
    const input = dto.emailOrUsername.toLowerCase().trim();
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: input },
          { profile: { username: input.replace(/^@/, '') } },
        ],
      },
      include: {
        profile: true,
        creditWallet: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-posta/kullanıcı adı veya şifre hatalı');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-posta/kullanıcı adı veya şifre hatalı');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('Hesabınız askıya alınmıştır');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.formatUser(user),
      tokens,
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, creditWallet: true },
    });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');
    return this.formatUser(user);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'loopin_super_secret_access_jwt_key_2026_change_in_production';
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'loopin_super_secret_refresh_jwt_key_2026_change_in_production';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '30d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  private formatUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: `@${user.profile?.username || 'user'}`,
      name: user.profile?.name || 'Loopin Kullanıcısı',
      avatarUrl: user.profile?.avatarUrl,
      bio: user.profile?.bio,
      isVerified: user.isVerified,
      isPro: user.isPro,
      role: user.role,
      trustScore: user.profile?.trustScore || 95,
      badgeTitle: user.profile?.badgeTitle || 'Süper Organizatör',
      creditBalance: user.creditWallet?.balance || 0,
      createdAt: user.createdAt,
    };
  }
}
