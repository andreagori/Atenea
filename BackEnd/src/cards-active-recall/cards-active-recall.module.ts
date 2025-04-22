import { Module } from '@nestjs/common';
import { CardsActiveRecallService } from './cards-active-recall.service';
import { CardsActiveRecallController } from './cards-active-recall.controller';

@Module({
  controllers: [CardsActiveRecallController],
  providers: [CardsActiveRecallService],
})
export class CardsActiveRecallModule {}
