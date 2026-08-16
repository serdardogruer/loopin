import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateProfileInput } from '@loopin/validation';
import { NotificationType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

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
        following: true,
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
        followingCount: user.following.length,
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

  /**
   * Toggle Follow / Unfollow with Notifications
   */
  async toggleFollow(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Kendinizi takip edemezsiniz.');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: { profile: true },
    });
    if (!targetUser) throw new NotFoundException('Kullanıcı bulunamadı');

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await this.prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      const followerCount = await this.prisma.follow.count({
        where: { followingId: targetUserId },
      });
      return { isFollowing: false, followerCount };
    } else {
      await this.prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });

      // Send NEW_FOLLOWER Notification
      const followerUser = await this.prisma.user.findUnique({
        where: { id: currentUserId },
        include: { profile: true },
      });
      const followerName = followerUser?.profile?.name || 'Bir kullanıcı';
      const followerUsername = `@${followerUser?.profile?.username || 'user'}`;
      const followerAvatar = followerUser?.profile?.avatarUrl;

      await this.notificationsService.createNotification(
        targetUserId,
        NotificationType.NEW_FOLLOWER,
        'Yeni Takipçi ✨',
        `${followerName} (${followerUsername}) sizi takip etmeye başladı.`,
        {
          followerId: currentUserId,
          followerUsername,
          followerName,
          followerAvatar,
        },
      );

      const followerCount = await this.prisma.follow.count({
        where: { followingId: targetUserId },
      });

      return { isFollowing: true, followerCount };
    }
  }

  /**
   * Get list of followers for a user
   */
  async getFollowers(targetUserId: string, currentUserId?: string) {
    const followers = await this.prisma.follow.findMany({
      where: { followingId: targetUserId },
      include: {
        follower: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check if current user is following each of them
    const currentUserFollowing = currentUserId
      ? await this.prisma.follow.findMany({
          where: { followerId: currentUserId },
          select: { followingId: true },
        })
      : [];
    const followingSet = new Set(currentUserFollowing.map((f) => f.followingId));

    return followers.map((f) => ({
      id: f.follower.id,
      name: f.follower.profile?.name || 'Kullanıcı',
      username: `@${f.follower.profile?.username || 'user'}`,
      avatarUrl: f.follower.profile?.avatarUrl,
      bio: f.follower.profile?.bio,
      trustScore: `%${f.follower.profile?.trustScore || 98} Güven Skoru`,
      isFollowing: followingSet.has(f.follower.id),
      isSelf: currentUserId === f.follower.id,
    }));
  }

  /**
   * Get list of users that target user is following
   */
  async getFollowing(targetUserId: string, currentUserId?: string) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: targetUserId },
      include: {
        following: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const currentUserFollowing = currentUserId
      ? await this.prisma.follow.findMany({
          where: { followerId: currentUserId },
          select: { followingId: true },
        })
      : [];
    const followingSet = new Set(currentUserFollowing.map((f) => f.followingId));

    return following.map((f) => ({
      id: f.following.id,
      name: f.following.profile?.name || 'Kullanıcı',
      username: `@${f.following.profile?.username || 'user'}`,
      avatarUrl: f.following.profile?.avatarUrl,
      bio: f.following.profile?.bio,
      trustScore: `%${f.following.profile?.trustScore || 98} Güven Skoru`,
      isFollowing: followingSet.has(f.following.id),
      isSelf: currentUserId === f.following.id,
    }));
  }
}
