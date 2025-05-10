import { Module } from '@nestjs/common';
import { PrismaController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from "./app.service";
import { UserModule } from './user/user.module';
import { DeckModule } from './deck/deck.module';
import { CardModule } from './card/card.module';
import { CardsActiveRecallModule } from './cards-active-recall/cards-active-recall.module';
import { CardsCornellModule } from './cards-cornell/cards-cornell.module';
import { ExamModule } from './exam/exam.module';
import { AuthModule } from './auth/auth.module';
import { VisualCardsModule } from './visual-cards/visual-cards.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { SessionResultsModule } from './session-results/session-results.module';
import { CardReviewsModule } from './card-reviews/card-reviews.module';
import { SimulatedTestsModule } from './simulated-tests/simulated-tests.module';
import { UserStatsModule } from './user-stats/user-stats.module';

@Module({
  imports: [PrismaModule, UserModule, DeckModule, CardModule, CardsActiveRecallModule, CardsCornellModule, ExamModule, AuthModule, VisualCardsModule, StudySessionsModule, SessionResultsModule, CardReviewsModule, SimulatedTestsModule, UserStatsModule],
  controllers: [PrismaController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
