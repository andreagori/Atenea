import { Module } from '@nestjs/common';
import { VisualCardsService } from './visual-cards.service';
import { VisualCardsController } from './visual-cards.controller';

@Module({
  controllers: [VisualCardsController],
  providers: [VisualCardsService],
})
export class VisualCardsModule {}
