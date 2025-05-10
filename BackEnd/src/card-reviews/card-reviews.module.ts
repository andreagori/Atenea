import { Module } from '@nestjs/common';
import { CardReviewsService } from './card-reviews.service';
import { CardReviewsController } from './card-reviews.controller';

@Module({
  controllers: [CardReviewsController],
  providers: [CardReviewsService],
})
export class CardReviewsModule {}
