import { Module } from '@nestjs/common';
import { PrismaController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from "./app.service";
import { UserModule } from './user/user.module';
import { DeckModule } from './deck/deck.module';
import { CardModule } from './card/card.module';
import { ExamModule } from './exam/exam.module';
import { AuthModule } from './auth/auth.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { SessionResultsModule } from './session-results/session-results.module';
import { CardReviewsModule } from './card-reviews/card-reviews.module';
import { SimulatedTestsModule } from './simulated-tests/simulated-tests.module';
import { UserStatsModule } from './user-stats/user-stats.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, UserModule, DeckModule, CardModule, ExamModule, AuthModule, StudySessionsModule, SessionResultsModule, CardReviewsModule, SimulatedTestsModule, UserStatsModule, CloudinaryModule],
  controllers: [PrismaController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
