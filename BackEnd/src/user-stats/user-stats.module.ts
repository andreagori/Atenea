import { Module } from '@nestjs/common';
import { UserStatsService } from './user-stats.service';
import { UserStatsController } from './user-stats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserStatsController],
  providers: [UserStatsService],
  exports: [UserStatsService]
})
export class UserStatsModule {}
