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

@Module({
  imports: [PrismaModule, UserModule, DeckModule, CardModule, CardsActiveRecallModule, CardsCornellModule, ExamModule, AuthModule],
  controllers: [PrismaController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
