import { Module } from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { StudySessionsController } from './study-sessions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserStatsModule } from '../user-stats/user-stats.module';
import { SchedulingModule } from '../scheduling/scheduling.module';

@Module({
  imports: [PrismaModule, UserStatsModule, SchedulingModule],
  controllers: [StudySessionsController],
  providers: [StudySessionsService],
  exports: [StudySessionsService],
})
export class StudySessionsModule {}
