import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
