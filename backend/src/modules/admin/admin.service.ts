import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalEvents, totalReels, totalReports, wallets] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.event.count({ where: { isCancelled: false } }),
      this.prisma.reel.count(),
      this.prisma.report.count({ where: { status: 'OPEN' } }),
      this.prisma.creditWallet.findMany({ select: { balance: true } }),
    ]);

    const totalCredits = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

    return {
      totalUsers,
      totalEvents,
      totalReels,
      openReports: totalReports,
      activeOnlineUsers: totalUsers > 0 ? totalUsers : 0,
      totalCreditsCirculating: totalCredits,
    };
  }

  async listUsers(page = 1, limit = 50) {
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
        avatarUrl: u.profile?.avatarUrl,
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
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: !user.isBanned },
    });

    return { userId: updated.id, isBanned: updated.isBanned };
  }

  async grantCredits(userId: string, amount: number, description?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { creditWallet: true },
    });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    let wallet = user.creditWallet;
    if (!wallet) {
      wallet = await this.prisma.creditWallet.create({
        data: { userId, balance: 0 },
      });
    }

    const newBalance = wallet.balance + amount;
    const updated = await this.prisma.creditWallet.update({
      where: { id: wallet.id },
      data: {
        balance: newBalance,
        transactions: {
          create: {
            amount,
            balanceAfter: newBalance,
            type: 'ADMIN_ADJUSTMENT',
            description: description || `Yönetici tarafından ${amount} kredi tanımlandı`,
          },
        },
      },
    });

    return { userId, newBalance: updated.balance };
  }
}
