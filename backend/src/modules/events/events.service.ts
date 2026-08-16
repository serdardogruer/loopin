import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreditsService } from '../credits/credits.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateEventInput } from '@loopin/validation';
import { NotificationType } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private creditsService: CreditsService,
    private notificationsService: NotificationsService,
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
        applications: userId ? { where: { userId } } : false,
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
        applications: userId ? { where: { userId } } : false,
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
        comments: { include: { user: { include: { profile: true } } } },
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

      // Send like notification to host
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: { host: { include: { profile: true } } },
      });
      if (event && event.hostId !== userId) {
        const liker = await this.prisma.user.findUnique({
          where: { id: userId },
          include: { profile: true },
        });
        const likerName = liker?.profile?.name || 'Bir kullanıcı';
        await this.notificationsService.createNotification(
          event.hostId,
          NotificationType.NEW_LIKE,
          'Yeni Beğeni ❤️',
          `${likerName}, "${event.title}" etkinliğinizi beğendi.`,
          { eventId, likerId: userId },
        );
      }

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

    // Notify host
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (event && event.hostId !== userId) {
      const commenterName = comment.user?.profile?.name || 'Bir kullanıcı';
      await this.notificationsService.createNotification(
        event.hostId,
        NotificationType.NEW_COMMENT,
        'Yeni Yorum 💬',
        `${commenterName}, "${event.title}" etkinliğinize yorum yaptı: "${text.substring(0, 40)}"`,
        { eventId, commentId: comment.id },
      );
    }

    return {
      id: comment.id,
      eventId: comment.eventId,
      userId: comment.userId,
      userName: comment.user?.profile?.name || 'Kullanıcı',
      userAvatar: comment.user?.profile?.avatarUrl,
      text: comment.text,
      createdAt: comment.createdAt,
    };
  }

  /**
   * Apply to participate in an event (Requires Host Approval)
   */
  async applyToEvent(eventId: string, userId: string, note?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { host: { include: { profile: true } }, participants: true },
    });

    if (!event) throw new NotFoundException('Etkinlik bulunamadı');
    if (event.hostId === userId) {
      throw new BadRequestException('Kendi etkinliğinizin organizatörüsünüz.');
    }

    const isParticipating = event.participants.some((p) => p.userId === userId);
    if (isParticipating) {
      throw new BadRequestException('Bu etkinliğe zaten katılmış durumdasınız.');
    }

    // Check existing application
    const existingApp = await this.prisma.eventApplication.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    if (existingApp?.status === 'PENDING') {
      return {
        status: 'PENDING',
        message: 'Katılım başvurunuz zaten organizatörün onayını bekliyor.',
      };
    }

    const application = await this.prisma.eventApplication.upsert({
      where: {
        eventId_userId: { eventId, userId },
      },
      update: {
        status: 'PENDING',
        note: note || null,
      },
      create: {
        eventId,
        userId,
        status: 'PENDING',
        note: note || null,
      },
    });

    // Notify event host
    const applicant = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    const applicantName = applicant?.profile?.name || 'Bir kullanıcı';
    const applicantAvatar = applicant?.profile?.avatarUrl;

    await this.notificationsService.createNotification(
      event.hostId,
      NotificationType.APPLICATION_RECEIVED,
      'Yeni Katılım Başvurusu 🎟️',
      `${applicantName}, "${event.title}" etkinliğinize katılmak için onayınızı bekliyor.`,
      {
        eventId,
        eventTitle: event.title,
        applicationId: application.id,
        applicantId: userId,
        applicantName,
        applicantAvatar,
      },
    );

    return {
      status: 'PENDING',
      applicationId: application.id,
      message: 'Katılım başvurunuz organizatöre iletildi. Onaylandığında bildirim alacaksınız!',
    };
  }

  /**
   * Host Approves Application
   */
  async approveApplication(applicationId: string, hostUserId: string) {
    const application = await this.prisma.eventApplication.findUnique({
      where: { id: applicationId },
      include: {
        event: true,
        user: { include: { profile: true } },
      },
    });

    if (!application) throw new NotFoundException('Başvuru bulunamadı');
    if (application.event.hostId !== hostUserId) {
      throw new BadRequestException('Bu başvuruyu onaylama yetkiniz yok.');
    }

    if (application.event.currentCapacity >= application.event.maxCapacity) {
      throw new BadRequestException('Etkinliğin kontenjanı tamamen dolmuştur.');
    }

    // 1. Update application status
    await this.prisma.eventApplication.update({
      where: { id: applicationId },
      data: { status: 'APPROVED' },
    });

    // 2. Add as participant
    await this.prisma.eventParticipant.upsert({
      where: {
        eventId_userId: {
          eventId: application.eventId,
          userId: application.userId,
        },
      },
      update: {},
      create: {
        eventId: application.eventId,
        userId: application.userId,
      },
    });

    // 3. Increment capacity
    await this.prisma.event.update({
      where: { id: application.eventId },
      data: {
        currentCapacity: { increment: 1 },
      },
    });

    // 4. Notify applicant
    await this.notificationsService.createNotification(
      application.userId,
      NotificationType.APPLICATION_APPROVED,
      'Başvurunuz Onaylandı! 🎉',
      `Tebrikler! "${application.event.title}" etkinliğine katılımınız onaylandı.`,
      { eventId: application.eventId },
    );

    return { success: true, message: 'Katılımcı başarıyla onaylandı.' };
  }

  /**
   * Host Rejects Application
   */
  async rejectApplication(applicationId: string, hostUserId: string) {
    const application = await this.prisma.eventApplication.findUnique({
      where: { id: applicationId },
      include: { event: true },
    });

    if (!application) throw new NotFoundException('Başvuru bulunamadı');
    if (application.event.hostId !== hostUserId) {
      throw new BadRequestException('Bu başvuruyu reddetme yetkiniz yok.');
    }

    await this.prisma.eventApplication.update({
      where: { id: applicationId },
      data: { status: 'REJECTED' },
    });

    // Notify applicant
    await this.notificationsService.createNotification(
      application.userId,
      NotificationType.APPLICATION_REJECTED,
      'Katılım Başvurusu Durumu',
      `"${application.event.title}" etkinliği için başvurunuz organizatör tarafından onaylanamadı.`,
      { eventId: application.eventId },
    );

    return { success: true, message: 'Başvuru reddedildi.' };
  }

  /**
   * Get applications for host event
   */
  async getEventApplications(eventId: string, hostUserId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Etkinlik bulunamadı');
    if (event.hostId !== hostUserId) {
      throw new BadRequestException('Bu etkinliğin başvurularını görüntüleme yetkiniz yok.');
    }

    const applications = await this.prisma.eventApplication.findMany({
      where: { eventId },
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return applications.map((a) => ({
      id: a.id,
      userId: a.userId,
      name: a.user?.profile?.name || 'Kullanıcı',
      username: `@${a.user?.profile?.username || 'user'}`,
      avatarUrl: a.user?.profile?.avatarUrl,
      status: a.status,
      note: a.note,
      createdAt: a.createdAt,
    }));
  }

  async toggleJoin(eventId: string, userId: string) {
    // If host, cannot leave own event
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!event) throw new NotFoundException('Etkinlik bulunamadı');
    if (event.hostId === userId) {
      return { isHost: true, message: 'Organizatörsünüz' };
    }

    const isParticipating = event.participants.some((p) => p.userId === userId);

    if (isParticipating) {
      // Leave
      await this.prisma.eventParticipant.deleteMany({
        where: { eventId, userId },
      });
      await this.prisma.eventApplication.updateMany({
        where: { eventId, userId },
        data: { status: 'CANCELLED' },
      });
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          currentCapacity: Math.max(0, event.currentCapacity - 1),
          isFull: false,
        },
      });
      return { joined: false, status: 'NONE' };
    } else {
      // Direct apply with pending approval
      return await this.applyToEvent(eventId, userId);
    }
  }

  private formatEvent(e: any, currentUserId?: string) {
    const isLiked = currentUserId ? e.likes?.some((l: any) => l.userId === currentUserId) : false;
    const isJoined = currentUserId ? e.participants?.some((p: any) => p.userId === currentUserId) : false;
    const isHost = currentUserId ? e.hostId === currentUserId : false;

    let applicationStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' = 'NONE';
    if (isJoined || isHost) {
      applicationStatus = 'APPROVED';
    } else if (e.applications && e.applications.length > 0) {
      applicationStatus = e.applications[0].status;
    }

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
      isHost,
      applicationStatus,
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
