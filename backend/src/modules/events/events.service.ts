import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreditsService } from '../credits/credits.service';
import { CreateEventInput } from '@loopin/validation';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private creditsService: CreditsService,
  ) {}

  async getFeed(userId?: string) {
    const events = await this.prisma.event.findMany({
      where: { isCancelled: false },
      orderBy: { createdAt: 'desc' },
      include: {
        host: {
          include: { profile: true },
        },
        participants: {
          include: {
            user: { include: { profile: true } },
          },
          take: 6,
        },
        comments: {
          include: {
            user: { include: { profile: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
      take: 20,
    });

    return events.map((e) => this.formatEvent(e, userId));
  }

  async getById(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        host: { include: { profile: true } },
        participants: {
          include: { user: { include: { profile: true } } },
        },
        comments: {
          include: { user: { include: { profile: true } } },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
    });

    if (!event) throw new NotFoundException('Etkinlik bulunamadı');
    return this.formatEvent(event, userId);
  }

  async create(userId: string, dto: CreateEventInput) {
    // 1. Deduct 5 credits for event creation
    await this.creditsService.executeCreditTransaction(
      userId,
      -5,
      'EVENT_CREATE',
      `"${dto.title}" etkinliği oluşturuldu`,
    );

    // 2. Parse date
    const parsedDate = new Date(dto.date);

    // 3. Create event
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        category: dto.category,
        dateText: dto.date,
        eventDate: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
        location: dto.location,
        maxCapacity: dto.maxCapacity,
        currentCapacity: 1, // Host is automatic first attendee
        priceType: dto.price,
        imageUrl: dto.imageUrl,
        description: dto.description,
        hostId: userId,
        participants: {
          create: {
            userId: userId,
          },
        },
      },
      include: {
        host: { include: { profile: true } },
        participants: { include: { user: { include: { profile: true } } } },
        comments: true,
        likes: true,
      },
    });

    return this.formatEvent(event, userId);
  }

  async toggleLike(eventId: string, userId: string) {
    const existing = await this.prisma.eventLike.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    if (existing) {
      await this.prisma.eventLike.delete({
        where: { id: existing.id },
      });
      return { liked: false };
    } else {
      await this.prisma.eventLike.create({
        data: { eventId, userId },
      });
      return { liked: true };
    }
  }

  async addComment(eventId: string, userId: string, text: string) {
    const comment = await this.prisma.eventComment.create({
      data: {
        eventId,
        userId,
        text,
      },
      include: {
        user: { include: { profile: true } },
      },
    });

    return {
      id: comment.id,
      eventId: comment.eventId,
      userId: comment.userId,
      userName: comment.user.profile?.name || 'Kullanıcı',
      userAvatar: comment.user.profile?.avatarUrl,
      text: comment.text,
      createdAt: comment.createdAt,
    };
  }

  async toggleJoin(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!event) throw new NotFoundException('Etkinlik bulunamadı');

    const isParticipating = event.participants.some((p) => p.userId === userId);

    if (isParticipating) {
      // Leave
      await this.prisma.eventParticipant.deleteMany({
        where: { eventId, userId },
      });
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          currentCapacity: Math.max(0, event.currentCapacity - 1),
          isFull: false,
        },
      });
      return { joined: false };
    } else {
      // Join
      if (event.currentCapacity >= event.maxCapacity) {
        throw new BadRequestException('Bu etkinliğin kontenjanı dolmuştur!');
      }

      await this.prisma.eventParticipant.create({
        data: { eventId, userId },
      });

      const updated = await this.prisma.event.update({
        where: { id: eventId },
        data: {
          currentCapacity: event.currentCapacity + 1,
          isFull: event.currentCapacity + 1 >= event.maxCapacity,
        },
      });

      return { joined: true, isFull: updated.isFull };
    }
  }

  private formatEvent(e: any, currentUserId?: string) {
    const isLiked = currentUserId ? e.likes?.some((l: any) => l.userId === currentUserId) : false;
    const isJoined = currentUserId ? e.participants?.some((p: any) => p.userId === currentUserId) : false;

    return {
      id: e.id,
      title: e.title,
      category: e.category,
      date: e.dateText || 'Tarih belirtilmedi',
      rawDate: e.eventDate,
      location: e.location,
      maxCapacity: e.maxCapacity,
      currentCapacity: e.currentCapacity,
      isFull: e.isFull || e.currentCapacity >= e.maxCapacity,
      price: e.priceType,
      imageUrl: e.imageUrl,
      description: e.description,
      hostId: e.hostId,
      hostName: e.host?.profile?.name || 'Organizatör',
      hostUsername: `@${e.host?.profile?.username || 'user'}`,
      hostAvatar: e.host?.profile?.avatarUrl,
      hostTrustScore: `%${e.host?.profile?.trustScore || 98} Güven Skoru`,
      likeCount: e.likes?.length || 0,
      commentCount: e.comments?.length || 0,
      isLiked,
      isJoined,
      attendees: (e.participants || []).map((p: any) => ({
        id: p.id,
        userId: p.userId,
        name: p.user?.profile?.name || 'Katılımcı',
        username: `@${p.user?.profile?.username || 'user'}`,
        avatarUrl: p.user?.profile?.avatarUrl,
        joinedAt: p.joinedAt,
      })),
      comments: (e.comments || []).map((c: any) => ({
        id: c.id,
        eventId: c.eventId,
        userId: c.userId,
        userName: c.user?.profile?.name || 'Kullanıcı',
        userAvatar: c.user?.profile?.avatarUrl,
        text: c.text,
        createdAt: c.createdAt,
      })),
      createdAt: e.createdAt,
    };
  }
}
