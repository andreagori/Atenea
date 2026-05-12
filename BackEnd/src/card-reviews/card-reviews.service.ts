import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardReviewDto } from './dto/create-card-review.dto';
import { StudyMethod } from '@prisma/client';
import { SchedulingService } from '../scheduling/scheduling.service';

@Injectable()
export class CardReviewsService {
  private readonly logger = new Logger(CardReviewsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduling: SchedulingService,
  ) {}

  private isValidSessionType(session: { studyMethod: StudyMethod }): boolean {
    return (
      session.studyMethod === StudyMethod.spacedRepetition ||
      session.studyMethod === StudyMethod.pomodoro
    );
  }

  async create(
    sessionId: number,
    cardId: number,
    userId: number,
    dto: CreateCardReviewDto,
  ) {
    const session = await this.prisma.studySession.findFirst({
      where: { sessionId, userId, endTime: null },
    });

    if (!session || !this.isValidSessionType(session)) {
      throw new NotFoundException('Sesión no encontrada o tipo incorrecto');
    }

    const scheduled = await this.scheduling.applyRating(
      userId,
      cardId,
      dto.evaluation,
    );

    return this.prisma.cardReview.create({
      data: {
        sessionId,
        cardId,
        userId,
        evaluation: dto.evaluation,
        timeSpent: dto.timeSpent,
        intervalMinutes: scheduled.intervalMinutes,
        nextReviewAt: scheduled.nextReviewAt,
      },
    });
  }

  async findBySession(sessionId: number, userId: number) {
    return this.prisma.cardReview.findMany({
      where: { sessionId, userId },
      include: { card: true },
    });
  }
}
