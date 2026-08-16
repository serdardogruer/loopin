import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreditTransactionType } from '@prisma/client';

@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    let wallet = await this.prisma.creditWallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!wallet) {
      wallet = await this.prisma.creditWallet.create({
        data: {
          userId,
          balance: 10,
          transactions: {
            create: {
              amount: 10,
              balanceAfter: 10,
              type: 'INITIAL_GRANT',
              description: 'Hoş geldin hediyesi (10 Kredi)',
            },
          },
        },
        include: {
          transactions: true,
        },
      });
    }

    return wallet;
  }

  /**
   * Concurrency-safe atomic credit transaction
   */
  async executeCreditTransaction(
    userId: string,
    amount: number, // negative for deduction, positive for top-up
    type: CreditTransactionType,
    description: string,
    referenceId?: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      let wallet = await tx.creditWallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        wallet = await tx.creditWallet.create({
          data: { userId, balance: 10 },
        });
      }

      if (amount < 0 && wallet.balance + amount < 0) {
        throw new BadRequestException(
          `Yetersiz kredi bakiyesi! Mevcut bakiyeniz: ${wallet.balance}, Gereken: ${Math.abs(amount)} Kredi. Lütfen kredi paketi yükleyiniz.`,
        );
      }

      const newBalance = wallet.balance + amount;

      const updatedWallet = await tx.creditWallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      });

      const transaction = await tx.creditTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          balanceAfter: newBalance,
          type,
          description,
          referenceId,
        },
      });

      return { wallet: updatedWallet, transaction };
    });
  }

  async getPackages() {
    return [
      {
        id: 'pkg-free',
        name: 'Normal Kullanıcı (Ücretsiz)',
        price: 0,
        credits: 10,
        maxApprovedParticipantsPerEvent: 1,
        description: 'Her etkinlik için 1 katılımcı onaylayabilir.',
      },
      {
        id: 'pkg-silver',
        name: 'Gümüş Paket',
        price: 100,
        credits: 50,
        maxApprovedParticipantsPerEvent: 2,
        description: 'Her etkinlik için 2 katılımcı onaylayabilir.',
      },
      {
        id: 'pkg-gold',
        name: 'Altın Paket',
        price: 400,
        credits: 200,
        maxApprovedParticipantsPerEvent: 3,
        popularBadge: 'En Popüler',
        description: 'Her etkinlik için 3 katılımcı onaylayabilir.',
      },
      {
        id: 'pkg-organizer',
        name: 'Organizatör Paketi',
        price: 4000,
        credits: 1000,
        maxApprovedParticipantsPerEvent: -1, // Sınırsız
        description: 'Sınırsız katılımcı onaylama hakkı ve organizatör rozeti.',
      },
    ];
  }
}
