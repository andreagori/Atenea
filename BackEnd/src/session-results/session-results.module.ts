import { Module } from '@nestjs/common';
import { SessionResultsService } from './session-results.service';
import { SessionResultsController } from './session-results.controller';

@Module({
  controllers: [SessionResultsController],
  providers: [SessionResultsService],
})
export class SessionResultsModule {}
