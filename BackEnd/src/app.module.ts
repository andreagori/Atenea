import { Module } from '@nestjs/common';
import { PrismaController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from "./app.service";
import { UserModule } from './user/user.module';
import { DeckModule } from './deck/deck.module';
import { CardModule } from './card/card.module';
import { AuthModule } from './auth/auth.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { CardReviewsModule } from './card-reviews/card-reviews.module';
import { UserStatsModule } from './user-stats/user-stats.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [PrismaModule, UserModule, DeckModule, CardModule, AuthModule, StudySessionsModule, CardReviewsModule, UserStatsModule, CloudinaryModule, AnalyticsModule],
  controllers: [PrismaController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
