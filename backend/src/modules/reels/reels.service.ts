import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateReelInput } from '@loopin/validation';

@Injectable()
export class ReelsService {
  constructor(private prisma: PrismaService) {}

  async getFeed(userId?: string) {
    const reels = await this.prisma.reel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { include: { profile: true } },
        likes: true,
        comments: {
          include: { user: { include: { profile: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      take: 20,
    });

    return reels.map((r) => {
      const isLiked = userId ? r.likes.some((l) => l.userId === userId) : false;
      const isSelf = userId ? r.userId === userId : false;

      return {
        id: r.id,
        publisherId: r.userId,
        publisherName: r.user?.profile?.name || 'Kullanıcı',
        publisherUsername: `@${r.user?.profile?.username || 'user'}`,
        publisherAvatar: r.user?.profile?.avatarUrl,
        caption: r.caption,
        mediaUrl: r.mediaUrl,
        mediaType: r.mediaType,
        likeCount: r.likes.length,
        commentCount: r.comments.length,
        isLiked,
        isSelf,
        comments: r.comments.map((c) => ({
          id: c.id,
          reelId: c.reelId,
          userId: c.userId,
          userName: c.user?.profile?.name || 'Kullanıcı',
          userAvatar: c.user?.profile?.avatarUrl,
          text: c.text,
          createdAt: c.createdAt,
        })),
        createdAt: r.createdAt,
      };
    });
  }

  async create(userId: string, dto: CreateReelInput) {
    const reel = await this.prisma.reel.create({
      data: {
        userId,
        caption: dto.caption,
        mediaUrl: dto.mediaUrl,
        mediaType: dto.mediaType,
      },
      include: {
        user: { include: { profile: true } },
        likes: true,
        comments: true,
      },
    });

    return {
      id: reel.id,
      publisherId: reel.userId,
      publisherName: reel.user?.profile?.name || 'Kullanıcı',
      publisherUsername: `@${reel.user?.profile?.username || 'user'}`,
      publisherAvatar: reel.user?.profile?.avatarUrl,
      caption: reel.caption,
      mediaUrl: reel.mediaUrl,
      mediaType: reel.mediaType,
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      isSelf: true,
      comments: [],
      createdAt: reel.createdAt,
    };
  }

  async toggleLike(reelId: string, userId: string) {
    const existing = await this.prisma.reelLike.findUnique({
      where: {
        reelId_userId: { reelId, userId },
      },
    });

    if (existing) {
      await this.prisma.reelLike.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await this.prisma.reelLike.create({
        data: { reelId, userId },
      });
      return { liked: true };
    }
  }

  async addComment(reelId: string, userId: string, text: string) {
    const comment = await this.prisma.reelComment.create({
      data: {
        reelId,
        userId,
        text,
      },
      include: {
        user: { include: { profile: true } },
      },
    });

    return {
      id: comment.id,
      reelId: comment.reelId,
      userId: comment.userId,
      userName: comment.user?.profile?.name || 'Kullanıcı',
      userAvatar: comment.user?.profile?.avatarUrl,
      text: comment.text,
      createdAt: comment.createdAt,
    };
  }
}
