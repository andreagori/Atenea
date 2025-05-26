import { Module } from '@nestjs/common';
import { CardReviewsService } from './card-reviews.service';
import { CardReviewsController } from './card-reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CardReviewsController],
  providers: [CardReviewsService],
  exports: [CardReviewsService],
})
export class CardReviewsModule {}
