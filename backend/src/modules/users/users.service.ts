import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { UpdateProfileInput } from '@loopin/validation';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(usernameOrId: string, currentUserId?: string) {
    const cleanUsername = usernameOrId.toLowerCase().replace(/^@/, '');

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: usernameOrId },
          { profile: { username: cleanUsername } },
        ],
      },
      include: {
        profile: true,
        hostedEvents: {
          where: { isCancelled: false },
          orderBy: { createdAt: 'desc' },
        },
        reels: {
          orderBy: { createdAt: 'desc' },
          include: { likes: true, comments: true },
        },
        followers: true,
      },
    });

    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    const isFollowing = currentUserId
      ? user.followers.some((f) => f.followerId === currentUserId)
      : false;

    return {
      id: user.id,
      name: user.profile?.name || 'Kullanıcı',
      username: `@${user.profile?.username || 'user'}`,
      avatarUrl: user.profile?.avatarUrl,
      bio: user.profile?.bio,
      isVerified: user.isVerified,
      isPro: user.isPro,
      trustScore: `%${user.profile?.trustScore || 98} Güven Skoru`,
      badgeTitle: user.profile?.badgeTitle || 'Süper Organizatör',
      stats: {
        reelsCount: user.reels.length,
        eventsCount: user.hostedEvents.length,
        followersCount: user.followers.length,
      },
      reels: user.reels.map((r) => ({
        id: r.id,
        imageUrl: r.mediaUrl,
        caption: r.caption,
        likeCount: r.likes.length,
        commentCount: r.comments.length,
        mediaType: r.mediaType,
      })),
      events: user.hostedEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.dateText,
        location: e.location,
        imageUrl: e.imageUrl,
        isHost: true,
      })),
      isFollowing,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileInput) {
    if (dto.username) {
      const cleanUsername = dto.username.toLowerCase().replace(/^@/, '');
      const existing = await this.prisma.profile.findFirst({
        where: {
          username: cleanUsername,
          userId: { not: userId },
        },
      });
      if (existing) {
        throw new ConflictException('Bu kullanıcı adı başka bir kullanıcı tarafından kullanılıyor');
      }
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        name: dto.name,
        username: dto.username ? dto.username.toLowerCase().replace(/^@/, '') : undefined,
        bio: dto.bio,
        avatarUrl: dto.avatarUrl || undefined,
      },
    });

    return {
      name: updated.name,
      username: `@${updated.username}`,
      avatarUrl: updated.avatarUrl,
      bio: updated.bio,
    };
  }
}
