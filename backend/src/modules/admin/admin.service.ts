import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalEvents, totalReels, totalReports] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.event.count({ where: { isCancelled: false } }),
      this.prisma.reel.count(),
      this.prisma.report.count({ where: { status: 'OPEN' } }),
    ]);

    return {
      totalUsers,
      totalEvents,
      totalReels,
      openReports: totalReports,
      activeOnlineUsers: Math.floor(totalUsers * 0.4) + 3,
      totalCreditsCirculating: 12500,
    };
  }

  async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: { profile: true, creditWallet: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        username: `@${u.profile?.username || 'user'}`,
        name: u.profile?.name || 'Kullanıcı',
        role: u.role,
        isVerified: u.isVerified,
        isPro: u.isPro,
        isBanned: u.isBanned,
        trustScore: u.profile?.trustScore || 95,
        creditBalance: u.creditWallet?.balance || 0,
        createdAt: u.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async toggleBanUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: !user.isBanned },
    });

    return { userId: updated.id, isBanned: updated.isBanned };
  }
}
