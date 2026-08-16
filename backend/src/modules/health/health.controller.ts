import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async check() {
    let dbStatus = 'ok';
    let redisStatus = 'ok';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected';
    }

    try {
      const redisClient = this.redisService.getClient();
      if (!redisClient || redisClient.status !== 'ready') {
        redisStatus = 'standby';
      }
    } catch {
      redisStatus = 'disconnected';
    }

    return {
      status: dbStatus === 'ok' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'loopin-backend-api',
      checks: {
        database: dbStatus,
        redis: redisStatus,
      },
    };
  }

  @Get('db')
  async checkDb() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected' };
    } catch (e: any) {
      return { status: 'error', database: 'disconnected', message: e?.message };
    }
  }

  @Get('redis')
  async checkRedis() {
    try {
      const redisClient = this.redisService.getClient();
      const isReady = redisClient && redisClient.status === 'ready';
      return { status: isReady ? 'ok' : 'standby', redis: isReady ? 'connected' : 'standby' };
    } catch (e: any) {
      return { status: 'error', redis: 'disconnected', message: e?.message };
    }
  }
}
