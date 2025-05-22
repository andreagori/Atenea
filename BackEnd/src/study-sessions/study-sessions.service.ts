import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { StudySession } from './entities/study-session.entity';
import { StudyMethod, LearningMethod } from '@prisma/client';

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

  async findAll() {
    return `This action returns all studySessions`;
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

  async update(id: number, updateStudySessionDto: UpdateStudySessionDto) {
    return `This action updates a #${id} studySession`;
  }

  async remove(id: number) {
    return `This action removes a #${id} studySession`;
  }
}
