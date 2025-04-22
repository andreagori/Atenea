import { Module } from '@nestjs/common';
import { CardsCornellService } from './cards-cornell.service';
import { CardsCornellController } from './cards-cornell.controller';

@Module({
  controllers: [CardsCornellController],
  providers: [CardsCornellService],
})
export class CardsCornellModule {}
