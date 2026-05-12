import { Module } from '@nestjs/common';
import { CardReviewsService } from './card-reviews.service';
import { CardReviewsController } from './card-reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SchedulingModule } from '../scheduling/scheduling.module';

@Module({
  imports: [PrismaModule, SchedulingModule],
  controllers: [CardReviewsController],
  providers: [CardReviewsService],
  exports: [CardReviewsService],
})
export class CardReviewsModule {}
