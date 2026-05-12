import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SchedulingService } from './scheduling.service';

@Module({
  imports: [PrismaModule],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
