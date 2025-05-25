import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { StudySession } from './entities/study-session.entity';
import { StudyMethod, LearningMethod } from '@prisma/client';
import { CardReview } from 'src/card-reviews/entities/card-review.entity';
import { TestResultDto } from './dto/test-result.dto';
import { TestAnswerDto } from 'src/test-question/dto/test-question.dto';

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
    try {
      // Get deck to count available cards
      const session = await this.prisma.studySession.findUnique({
        where: { sessionId },
        select: { deckId: true, learningMethod: true }
      });

      if (!session) {
        throw new NotFoundException('Sesión no encontrada');
      }

      // Count available cards that match learning methods
      const availableCardCount = await this.prisma.card.count({
        where: {
          deckId: session.deckId,
          learningMethod: {
            in: session.learningMethod
          }
        }
      });

      console.log(`Cartas disponibles para test: ${availableCardCount}`);

      // Si numQuestions es -1, usar el número total de cartas disponibles
      // o un valor máximo (como 10) si hay demasiadas cartas
      let numQuestions = dto.numQuestions;
      if (numQuestions === -1 || numQuestions === undefined) {
        numQuestions = Math.min(availableCardCount, this.defaultValues.simulatedTest.numQuestions);
      } else {
        // Si se especifica un número, asegurarse de que no sea mayor que las cartas disponibles
        numQuestions = Math.min(numQuestions, availableCardCount);
      }

      const testDurationMin = dto.testDurationMinutes === -1 ?
        this.defaultValues.simulatedTest.testDurationMin : dto.testDurationMinutes;

      console.log(`Creando test simulado con ${numQuestions} preguntas y ${testDurationMin} minutos`);

      const data = {
        sessionId,
        numQuestions,
        testDurationMin,
      };

      return this.prisma.sessionSimulatedTest.create({ data });
    } catch (error) {
      console.error('Error al crear sesión de test simulado:', error);
      throw error;
    }
  }

  private async createSpacedRepetitionSession(sessionId: number, dto: CreateStudySessionDto) {
    // Get the session with its deck and cards
    const session = await this.prisma.studySession.findUnique({
      where: { sessionId },
      include: {
        deck: {
          include: {
            cards: {
              where: {
                learningMethod: {
                  in: dto.learningMethod
                }
              }
            }
          }
        }
      }
    });

    if (!session || !session.deck) {
      throw new NotFoundException(`Sesión ${sessionId} o mazo no encontrado`);
    }

    const totalCards = session.deck.cards?.length || 0;

    if (totalCards === 0) {
      throw new BadRequestException('No hay cartas disponibles para esta sesión');
    }

    const data = {
      sessionId,
      numCardsSpaced: dto.numCardsSpaced || totalCards,
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

    return session;
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

    // Get session configuration and card limit based on study method
    let cardLimit: number | undefined;
    switch (session.studyMethod) {
      case StudyMethod.spacedRepetition:
        const activeRecall = await this.prisma.sessionActiveRecall.findUnique({
          where: { sessionId }
        });
        cardLimit = activeRecall?.numCardsSpaced;
        break;
      case StudyMethod.pomodoro:
        const pomodoro = await this.prisma.sessionPomodoro.findUnique({
          where: { sessionId }
        });
        cardLimit = pomodoro?.numCards;
        break;
      case StudyMethod.simulatedTest:
        const simulatedTest = await this.prisma.sessionSimulatedTest.findUnique({
          where: { sessionId }
        });
        cardLimit = simulatedTest?.numQuestions;
        break;
    }

    // Check if we've reached the card limit (-1 means no limit)
    if (cardLimit !== -1 && cardLimit !== undefined && reviews.length >= cardLimit) {
      this.logger.debug(`Reached card limit (${reviews.length}/${cardLimit})`);
      await this.finishSession(sessionId, userId);
      return null;
    }

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
        activeRecall: true,
        cornell: true,
        visualCard: true
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

  // SIMULATED TEST METHODS
  async getTestQuestion(sessionId: number, userId: number) {
    try {
      // Verify session exists and is not finished
      const session = await this.validateTestSession(sessionId, userId);

      // Get test configuration with questions
      const testConfig = await this.prisma.sessionSimulatedTest.findUnique({
        where: { sessionId },
        include: { testQuestions: true }
      });

      if (!testConfig) {
        throw new NotFoundException('Configuración del test no encontrada');
      }

      // Check if we've reached the question limit
      if (testConfig.testQuestions.length >= testConfig.numQuestions) {
        await this.finishSession(sessionId, userId);
        return null;
      }

      // Get all cards from deck that match session's learning methods
      // Solo excluimos las cartas que ya han sido usadas como pregunta principal
      const usedCardIds = testConfig.testQuestions.map(q => q.cardId);

      const availableCardsForQuestion = await this.prisma.card.findMany({
        where: {
          deckId: session.deckId,
          learningMethod: {
            in: session.learningMethod
          },
          NOT: {
            cardId: {
              in: usedCardIds
            }
          }
        },
        include: {
          activeRecall: true,
          cornell: true,
          visualCard: true
        }
      });

      // Filtrar las cartas que tienen contenido válido para mostrar como pregunta
      const validQuestionCards = availableCardsForQuestion.filter(card => {
        try {
          const content = this.getCardContent(card);
          return !!content && content !== 'Error getting content' &&
            content !== 'No content available' &&
            content !== 'Unknown card type';
        } catch (e) {
          return false;
        }
      });

      // Si no hay cartas válidas para usar como pregunta, finalizar el test
      if (validQuestionCards.length === 0) {
        console.log('No hay más cartas disponibles para preguntas. Finalizando test.');

        // Ajustar el número total de preguntas al alcanzado
        await this.prisma.sessionSimulatedTest.update({
          where: { sessionId },
          data: { numQuestions: testConfig.testQuestions.length }
        });

        await this.finishSession(sessionId, userId);
        return null;
      }

      // Seleccionar una carta aleatoria como pregunta correcta
      const correctCard = validQuestionCards[Math.floor(Math.random() * validQuestionCards.length)];

      // Obtener todas las cartas disponibles para opciones (incluidas las usadas como pregunta)
      const allAvailableCards = await this.prisma.card.findMany({
        where: {
          deckId: session.deckId,
          learningMethod: {
            in: session.learningMethod
          },
          NOT: {
            cardId: correctCard.cardId  // Excluir solo la carta actual
          }
        },
        include: {
          activeRecall: true,
          cornell: true,
          visualCard: true
        }
      });

      // Filtrar para opciones válidas
      const validOptionCards = allAvailableCards.filter(card => {
        try {
          const content = this.getCardContent(card);
          return !!content && content !== 'Error getting content' &&
            content !== 'No content available' &&
            content !== 'Unknown card type';
        } catch (e) {
          return false;
        }
      });

      // Si no hay suficientes cartas para opciones, usar las disponibles y avisar
      if (validOptionCards.length < 2) {
        console.log(`No hay suficientes opciones incorrectas: ${validOptionCards.length}`);

        // Si no hay ninguna opción disponible, finalizar
        if (validOptionCards.length === 0) {
          await this.finishSession(sessionId, userId);
          return null;
        }

        // Con una opción incorrecta, proceder con solo 2 opciones en total
        const incorrectCards = this.shuffleArray(validOptionCards).slice(0, 1);

        // Crear pregunta con solo 2 opciones
        const testQuestion = await this.prisma.testQuestion.create({
          data: {
            testId: sessionId,
            cardId: correctCard.cardId,
            optionsOrder: this.shuffleArray([0, 1])  // Solo 2 opciones: correcta e incorrecta
          }
        });

        // Preparar opciones
        const options: { cardId: number; content: string; type: LearningMethod }[] = [];
        for (let i = 0; i < testQuestion.optionsOrder.length; i++) {
          const index = testQuestion.optionsOrder[i];
          const card = index === 0 ? correctCard : incorrectCards[0];
          options.push({
            cardId: card.cardId,
            content: this.getCardContent(card),
            type: card.learningMethod
          });
        }

        return {
          questionId: testQuestion.questionId,
          title: correctCard.title,
          options,
          progress: {
            current: testConfig.testQuestions.length + 1,
            total: testConfig.numQuestions
          }
        };
      }

      // Si hay suficientes opciones, proceder normalmente con 3 opciones
      const incorrectCards = this.shuffleArray(validOptionCards).slice(0, 2);

      // Crear pregunta con 3 opciones
      const testQuestion = await this.prisma.testQuestion.create({
        data: {
          testId: sessionId,
          cardId: correctCard.cardId,
          optionsOrder: this.shuffleArray([0, 1, 2])
        }
      });

      // Preparar opciones
      const allCards = [correctCard, ...incorrectCards];
      const options: { cardId: number; content: string; type: LearningMethod }[] = [];

      for (let i = 0; i < testQuestion.optionsOrder.length; i++) {
        const index = testQuestion.optionsOrder[i];
        options.push({
          cardId: allCards[index].cardId,
          content: this.getCardContent(allCards[index]),
          type: allCards[index].learningMethod
        });
      }

      return {
        questionId: testQuestion.questionId,
        title: correctCard.title,
        options,
        progress: {
          current: testConfig.testQuestions.length + 1,
          total: testConfig.numQuestions
        }
      };
    } catch (error) {
      console.error('Error en getTestQuestion:', error);
      throw error;
    }
  }

  private getCardContent(card: any): string {
    try {
      console.log('Getting content for card:', JSON.stringify(card, null, 2));

      if (!card || !card.learningMethod) {
        throw new Error('Invalid card data: card or learningMethod is undefined');
      }

      switch (card.learningMethod) {
        case 'activeRecall':
          if (!card.activeRecall?.answer) {
            console.warn(`Card ${card.cardId} is activeRecall but has no answer`);
            return card.title || 'No content available';
          }
          return card.activeRecall.answer;

        case 'cornell':
          // Comprobar diferentes estructuras posibles para cartas Cornell
          if (card.cornell?.principalNote) {
            return card.cornell.principalNote;
          }
          if (card.principalNote) {
            return card.principalNote;
          }
          console.warn(`Card ${card.cardId} is cornell but has no principalNote`);
          return card.title || 'No content available';

        case 'visualCard':
          if (!card.visualCard?.urlImage) {
            console.warn(`Card ${card.cardId} is visualCard but has no urlImage`);
            return card.title || 'No image available';
          }
          return card.visualCard.urlImage;

        default:
          console.warn(`Unsupported card type: ${card.learningMethod}`);
          return card.title || 'Unknown card type';
      }
    } catch (error) {
      console.error('Error getting card content:', error);
      console.error('Card data:', card);
      return 'Error getting content';
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async getTestProgress(sessionId: number, userId: number) {
    // Pasar true como tercer parámetro para permitir sesiones finalizadas
    const session = await this.validateTestSession(sessionId, userId, true);

    const testConfig = await this.prisma.sessionSimulatedTest.findUnique({
      where: { sessionId },
      include: { testQuestions: true }
    });

    if (!testConfig) {
      throw new NotFoundException('Configuración del test no encontrada');
    }

    return {
      totalQuestions: testConfig.numQuestions,
      answeredQuestions: testConfig.testQuestions.length,
      correctAnswers: testConfig.correctAnswers || 0,
      incorrectAnswers: testConfig.incorrectAnswers || 0,
      remainingTime: this.calculateRemainingTime(session.startTime, testConfig.testDurationMin),
      isComplete: !!session.endTime
    };
  }

  async getTestResult(sessionId: number, userId: number): Promise<TestResultDto> {
    // No importe si la sesión está finalizada o no
    const session = await this.prisma.studySession.findFirst({
      where: {
        sessionId,
        userId
      },
      include: {
        simulatedTest: {
          include: {
            testQuestions: true
          }
        }
      }
    });

    if (!session) {
      throw new NotFoundException(`Sesión con ID ${sessionId} no encontrada`);
    }

    if (session.studyMethod !== StudyMethod.simulatedTest || !session.simulatedTest) {
      throw new BadRequestException('Esta sesión no es un test simulado');
    }

    // Calcular puntuación incluso si la sesión no ha finalizado
    const correctAnswers = session.simulatedTest.correctAnswers || 0;
    const incorrectAnswers = session.simulatedTest.incorrectAnswers || 0;
    const answeredQuestions = correctAnswers + incorrectAnswers;

    // Evitar división por cero
    const score = answeredQuestions > 0
      ? Math.round((correctAnswers / answeredQuestions) * 100)
      : 0;

    // Calcular tiempo utilizado hasta ahora
    const endTime = session.endTime || new Date();
    const timeSpent = Math.round((endTime.getTime() - session.startTime.getTime()) / 60000); // en minutos

    return {
      sessionId,
      correctAnswers,
      incorrectAnswers,
      score,
      timeSpent
    };
  }

  private calculateRemainingTime(startTime: Date, durationMinutes: number): number {
    const now = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    const remainingMs = endTime.getTime() - now.getTime();
    return Math.max(0, Math.floor(remainingMs / 1000)); // Return remaining seconds
  }

  async evaluateTestAnswer(sessionId: number, userId: number, answerDto: TestAnswerDto) {
    try {
      const session = await this.validateTestSession(sessionId, userId);

      const testQuestion = await this.prisma.testQuestion.findUnique({
        where: { questionId: answerDto.questionId },
        include: { correctCard: true }
      });

      if (!testQuestion) {
        throw new NotFoundException('Pregunta no encontrada');
      }

      console.log('Evaluando respuesta:', {
        questionId: answerDto.questionId,
        selectedOptionIndex: answerDto.selectedOptionIndex,
        optionsOrder: testQuestion.optionsOrder,
      });

      // Verificar índice válido
      if (answerDto.selectedOptionIndex < 0 || answerDto.selectedOptionIndex >= testQuestion.optionsOrder.length) {
        throw new BadRequestException(`Índice de opción seleccionada inválido: ${answerDto.selectedOptionIndex}`);
      }

      // El valor en optionsOrder para el índice seleccionado
      // Si optionsOrder es [2,0,1] y selectedOptionIndex es 1, entonces selectedValue es 0
      const selectedValue = testQuestion.optionsOrder[answerDto.selectedOptionIndex];

      // La respuesta es correcta si el valor seleccionado es 0 (que representa la posición de la respuesta correcta)
      const isCorrect = selectedValue === 0;

      // Update test question with user's answer
      await this.prisma.testQuestion.update({
        where: { questionId: testQuestion.questionId },
        data: {
          userAnswer: testQuestion.correctCard.cardId, // Siempre guardamos el cardId correcto
          isCorrect,
          timeSpent: answerDto.timeSpent || 1
        }
      });

      // Update test statistics
      await this.prisma.sessionSimulatedTest.update({
        where: { sessionId },
        data: {
          correctAnswers: {
            increment: isCorrect ? 1 : 0
          },
          incorrectAnswers: {
            increment: isCorrect ? 0 : 1
          }
        }
      });

      return { isCorrect };
    } catch (error) {
      console.error('Error en evaluateTestAnswer:', error);
      throw error;
    }
  }

  private async validateTestSession(sessionId: number, userId: number, allowFinished: boolean = false) {
    const session = await this.prisma.studySession.findFirst({
      where: {
        sessionId,
        userId
      },
      include: {
        simulatedTest: true
      }
    });

    if (!session) {
      throw new NotFoundException(`Sesión con ID ${sessionId} no encontrada o no pertenece al usuario`);
    }

    if (session.studyMethod !== StudyMethod.simulatedTest) {
      throw new BadRequestException('Esta sesión no es un test simulado');
    }

    // Solo validamos si la sesión está finalizada cuando no se permite explícitamente
    if (!allowFinished && session.endTime) {
      throw new BadRequestException('Esta sesión ya ha finalizado');
    }

    return session;
  }

  /**
   * Termina una sesión de estudio
   * @param sessionId ID de la sesión de estudio
   * @param userId ID del usuario
   * @returns Sesión de estudio actualizada o mensaje de error con el endTime
   */
  async finishSession(sessionId: number, userId: number) {
    try {
      // Verificar que la sesión existe y pertenece al usuario
      const session = await this.prisma.studySession.findFirst({
        where: {
          sessionId,
          userId
        }
      });

      if (!session) {
        throw new NotFoundException(`Sesión ${sessionId} no encontrada o no pertenece al usuario`);
      }

      // Si ya está finalizada, simplemente devolver la sesión
      if (session.endTime) {
        console.log(`La sesión ${sessionId} ya estaba finalizada`);
        return session;
      }

      // Finalizar la sesión
      const updatedSession = await this.prisma.studySession.update({
        where: { sessionId },
        data: { endTime: new Date() }
      });

      console.log(`Sesión ${sessionId} finalizada correctamente`);
      return updatedSession;
    } catch (error) {
      console.error(`Error finalizando sesión ${sessionId}:`, error);
      throw error;
    }
  }
}
