import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './core/prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { ReelsModule } from './modules/reels/reels.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CreditsModule } from './modules/credits/credits.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    EventsModule,
    ReelsModule,
    MessagesModule,
    CreditsModule,
    UploadsModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
