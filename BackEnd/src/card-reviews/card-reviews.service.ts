import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardReview } from './entities/card-review.entity';
import { CreateCardReviewDto } from './dto/create-card-review.dto';
import { UpdateCardReviewDto } from './dto/update-card-review.dto';
import { Evaluation, StudyMethod } from '@prisma/client';
import { StudySession } from '../study-sessions/entities/study-session.entity';

@Injectable()
export class CardReviewsService {
  // Logger for the CardReview class, which is used to log messages and errors.
  private readonly logger = new Logger(CardReviewsService.name);
  // PrismaService instance for database operations.
  constructor(private readonly prisma: PrismaService) { }

  private isValidSessionType(session: { studyMethod: StudyMethod }): boolean {
    return session.studyMethod === StudyMethod.spacedRepetition ||
      session.studyMethod === StudyMethod.pomodoro;
  }

  async create(sessionId: number, cardId: number, userId: number, createCardReviewDto: CreateCardReviewDto) {
    const session = await this.prisma.studySession.findFirst({
      where: {
        sessionId,
        userId,
        endTime: null // Solo sesiones activas
      }
    });

    if (!session || !this.isValidSessionType(session)) {
      throw new NotFoundException('Sesión no encontrada o tipo incorrecto');
    }

    // Calcular próxima revisión
    const intervalMinutes = this.calculateReviewInterval(createCardReviewDto.evaluation);
    const nextReviewAt = new Date();
    nextReviewAt.setMinutes(nextReviewAt.getMinutes() + intervalMinutes);

    // Crear la revisión
    return this.prisma.cardReview.create({
      data: {
        sessionId,
        cardId,
        userId,
        evaluation: createCardReviewDto.evaluation,
        timeSpent: createCardReviewDto.timeSpent,
        intervalMinutes,
        nextReviewAt
      }
    });
  }

  private calculateReviewInterval(evaluation: Evaluation): number {
    const intervals = {
      dificil: 1,      // Revisar en 1 minuto
      masomenos: 5,    // Revisar en 5 minutos
      bien: 10,        // Revisar en 10 minutos
      facil: 15        // Revisar en 15 minutos
    };

    return intervals[evaluation];
  }

  async findBySession(sessionId: number, userId: number) {
    return this.prisma.cardReview.findMany({
      where: {
        sessionId,
        userId
      },
      include: {
        card: true
      }
    });
  }

}
