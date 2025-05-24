import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { StudySession } from './entities/study-session.entity';
import { StudyMethod, LearningMethod } from '@prisma/client';
import { CardReview } from 'src/card-reviews/entities/card-review.entity';

@Injectable()
export class StudySessionsService {
  // Logger for the StudySessionsService class, which is used to log messages and errors.
  private readonly logger = new Logger(StudySessionsService.name);
  // PrismaService instance for database operations.
  constructor(private readonly prisma: PrismaService) { }

  // Valores por defecto para cada tipo de sesión
  private readonly defaultValues = {
    pomodoro: {
      numCards: 10,
      studyMinutes: 25,
      restMinutes: 5,
    },
    simulatedTest: {
      numQuestions: 10,
      testDurationMin: 15,
    },
    spacedRepetition: {
      numCardsSpaced: 10,
    }
  };

  /**
   * Crea una nueva sesión de estudio
   * @param createStudySessionDto
   * @returns Sesión de estudio creada o mensaje de error
   */
  async create(createStudySessionDto: CreateStudySessionDto, userId: number, deckId: number) {
    const deck = await this.prisma.deck.findFirst({
      where: {
        deckId,
        userId
      },
      include: {
        cards: {
          where: {
            learningMethod: {
              in: createStudySessionDto.learningMethod
            }
          }
        }
      }
    });

    if (!deck) {
      throw new NotFoundException(`Deck con ID ${deckId} no encontrado o no pertenece al usuario`);
    }

    if (deck.cards.length === 0) {
      throw new BadRequestException('El deck no tiene cartas para estudiar');
    }

    const sessionData = {
      userId,
      deckId,
      startTime: new Date(),
      // endTime: null, // Duración en minutos convertida a milisegundos
      learningMethod: createStudySessionDto.learningMethod,
      studyMethod: createStudySessionDto.studyMethod
    };

    const session = await this.prisma.studySession.create({
      data: sessionData
    });

    switch (createStudySessionDto.studyMethod) {
      case StudyMethod.pomodoro:
        await this.createPomodoroSession(session.sessionId, createStudySessionDto);
        break;
      case StudyMethod.simulatedTest:
        await this.createSimulatedTestSession(session.sessionId, createStudySessionDto);
        break;
      case StudyMethod.spacedRepetition:
        await this.createSpacedRepetitionSession(session.sessionId, createStudySessionDto);
        break;
    }

    return this.findOne(session.sessionId, userId);
  }

  /**
   * Tipos de sesiones de estudio
   * - Pomodoro: Estudia durante un tiempo determinado y luego descansa.
   * - Simulated Test: Realiza un test simulado con preguntas.
   * - Spaced Repetition: Revisa las cartas en intervalos de tiempo específicos.
   */

  private async createPomodoroSession(sessionId: number, dto: CreateStudySessionDto) {
    const data = {
      sessionId,
      numCards: dto.numCards || this.defaultValues.pomodoro.numCards,
      studyMinutes: dto.studyMinutes || this.defaultValues.pomodoro.studyMinutes,
      restMinutes: dto.restMinutes || this.defaultValues.pomodoro.restMinutes,
    };
    return this.prisma.sessionPomodoro.create({ data });
  }

  private async createSimulatedTestSession(sessionId: number, dto: CreateStudySessionDto) {
    const data = {
      sessionId,
      numQuestions: dto.numQuestions || this.defaultValues.simulatedTest.numQuestions,
      testDurationMin: dto.testDurationMinutes || this.defaultValues.simulatedTest.testDurationMin,
    };
    return this.prisma.sessionSimulatedTest.create({ data });
  }

  private async createSpacedRepetitionSession(sessionId: number, dto: CreateStudySessionDto) {
    const data = {
      sessionId,
      numCardsSpaced: dto.numCardsSpaced || this.defaultValues.spacedRepetition.numCardsSpaced,
    };
    return this.prisma.sessionActiveRecall.create({ data });
  }

  async findAll(userId: number) {
    return this.prisma.studySession.findMany({
      where: {
        userId
      },
      include: {
        deck: true,
        activeRecall: true,
        pomodoro: true,
        simulatedTest: true,
        cardReviews: {
          include: {
            card: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });
  }

  /**
   * Encuentra una sesión de estudio por su ID y el ID del usuario
   * @param sessionId ID de la sesión de estudio
   * @param userId ID del usuario
   * @returns Sesión de estudio encontrada o mensaje de error
   */
  async findOne(sessionId: number, userId: number) {
    const session = await this.prisma.studySession.findFirst({
      where: {
        sessionId,
        userId
      },
      include: {
        pomodoro: true,
        simulatedTest: true,
        activeRecall: true,
        deck: {
          include: {
            cards: true
          }
        }
      }
    });

    if (!session) {
      throw new NotFoundException(`Sesión con ID ${sessionId} no encontrada`);
    }

    // Filtramos las cartas para mostrar solo las que coinciden con los métodos de aprendizaje de la sesión
    if (session.deck) {
      session.deck.cards = session.deck.cards.filter(card =>
        session.learningMethod.includes(card.learningMethod)
      );
    }

    return session; // Añadimos el return que faltaba
  }

  // SPACED_REPETITION METHODS

  /**
   * Para obtener la siguiente carta para revisar en una sesión de repetición espaciada
   * @param sessionId ID de la sesión de estudio
   * @param userId ID del usuario
   * @returns Carta para revisar o null si no hay más cartas
   */
  async getNextCard(sessionId: number, userId: number) {
    const session = await this.findOne(sessionId, userId);

    if (!session || session.endTime) {
        throw new NotFoundException('Sesión no encontrada o ya finalizada');
    }

    const reviews = await this.prisma.cardReview.findMany({
        where: {
            sessionId,
            userId,
            nextReviewAt: {
                gt: new Date() // Solo cartas que no necesitan revisión aún
            }
        }
    });

    // Obtener las cartas disponibles con sus relaciones
    const availableCards = await this.prisma.card.findMany({
        where: {
            deckId: session.deckId,
            learningMethod: {
                in: session.learningMethod
            },
            NOT: {
                cardId: {
                    in: reviews.map(review => review.cardId)
                }
            }
        },
        include: {
            activeRecall: true,  // Incluir la relación con activeRecall
            cornell: true,       // Incluir la relación con cornell
            visualCard: true     // Incluir la relación con visualCard
        }
    });

    if (availableCards.length === 0) {
        await this.checkSessionCompletion(sessionId, userId);
        return null;
    }

    // Seleccionar una carta aleatoria
    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    console.log('Selected card with relations:', randomCard); // Debug log

    return randomCard;
}

  async getSpacedRepetitionProgress(sessionId: number, userId: number) {
    const reviews = await this.prisma.cardReview.findMany({
      where: {
        sessionId,
        userId
      },
      include: {
        card: true
      }
    });

    const totalCards = (await this.findOne(sessionId, userId)).deck.cards.length;
    const reviewedCards = reviews.length;

    return {
      totalCards,
      reviewedCards,
      remainingCards: totalCards - reviewedCards,
      reviews
    };
  }

  async getCardsToReview(sessionId: number, userId: number) {
    const session = await this.findOne(sessionId, userId);
    const now = new Date();

    // Obtener todas las revisiones de la sesión
    const reviews = await this.prisma.cardReview.findMany({
      where: {
        sessionId,
        userId,
        nextReviewAt: {
          lte: now
        }
      },
      orderBy: {
        nextReviewAt: 'asc'
      },
      include: {
        card: true
      }
    });

    return reviews;
  }

  async checkSessionCompletion(sessionId: number, userId: number) {
    const progress = await this.getSpacedRepetitionProgress(sessionId, userId);

    if (progress.remainingCards === 0) {
      // Finalizar la sesión automáticamente
      await this.finishSession(sessionId, userId);
      return true;
    }

    return false;
  }

  /**
   * Termina una sesión de estudio
   * @param sessionId ID de la sesión de estudio
   * @param userId ID del usuario
   * @returns Sesión de estudio actualizada o mensaje de error con el endTime
   */
  async finishSession(sessionId: number, userId: number) {
    const session = await this.prisma.studySession.findFirst({
        where: {
            sessionId,
            userId,
            endTime: null
        }
    });

    if (!session) {
        throw new NotFoundException('Sesión activa no encontrada');
    }

    const endTime = new Date();
    const startTime = session.startTime;
    const durationInMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

    return this.prisma.studySession.update({
        where: { sessionId },
        data: { 
            endTime,
            minDuration: durationInMinutes
        }
    });
  }
}
