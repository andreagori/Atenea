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
    // Get the session with its deck and cards to count available cards
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

    const totalAvailableCards = session.deck.cards?.length || 0;

    if (totalAvailableCards === 0) {
      throw new BadRequestException('No hay cartas disponibles para esta sesión');
    }

    // Si numCards es -1, usar todas las cartas disponibles
    let numCards = dto.numCards;
    if (numCards === -1 || numCards === undefined) {
      numCards = totalAvailableCards;
    } else {
      // Asegurar que no exceda las cartas disponibles
      numCards = Math.min(numCards, totalAvailableCards);
    }

    const data = {
      sessionId,
      numCards,
      studyMinutes: dto.studyMinutes || this.defaultValues.pomodoro.studyMinutes,
      restMinutes: dto.restMinutes || this.defaultValues.pomodoro.restMinutes,
      currentCycle: 1,
      isOnBreak: false,
      studyStartTime: new Date(), // Iniciar el tiempo de estudio inmediatamente
      totalStudyTimeMin: 0,
      totalBreakTimeMin: 0
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
    try {
      // Obtener la sesión con su configuración
      const session = await this.prisma.studySession.findFirst({
        where: { sessionId, userId },
        include: {
          activeRecall: true,
          pomodoro: true,
          simulatedTest: true,
          deck: {
            include: {
              cards: {
                where: {
                  learningMethod: {
                    in: [] // Se llenará dinámicamente
                  }
                }
              }
            }
          }
        }
      });

      if (!session) {
        throw new NotFoundException(`Sesión ${sessionId} no encontrada`);
      }

      // Actualizar el filtro de cartas
      if (session.deck) {
        session.deck.cards = await this.prisma.card.findMany({
          where: {
            deckId: session.deckId,
            learningMethod: {
              in: session.learningMethod
            }
          }
        });
      }

      // Obtener revisiones completadas
      const completedReviews = await this.prisma.cardReview.findMany({
        where: { sessionId, userId }
      });

      let shouldFinish = false;
      let cardLimit = 0;

      // Verificar condiciones de finalización según el tipo de sesión
      switch (session.studyMethod) {
        case StudyMethod.spacedRepetition:
          cardLimit = session.activeRecall?.numCardsSpaced || session.deck?.cards?.length || 0;
          shouldFinish = completedReviews.length >= cardLimit;
          console.log('Spaced Repetition - Revisiones completadas:', {
            completedReviews: completedReviews.length,
            cardLimit,
            shouldFinish
          });
          break;

        case StudyMethod.pomodoro:
          cardLimit = session.pomodoro?.numCards || session.deck?.cards?.length || 0;
          shouldFinish = completedReviews.length >= cardLimit;
          console.log('Pomodoro - Revisiones completadas:', {
            completedReviews: completedReviews.length,
            cardLimit,
            shouldFinish
          });
          break;

        case StudyMethod.simulatedTest:
          // Para test simulado, verificar preguntas respondidas
          const answeredQuestions = await this.prisma.testQuestion.count({
            where: {
              testId: sessionId,
              userAnswer: { not: null }
            }
          });
          cardLimit = session.simulatedTest?.numQuestions || 0;
          shouldFinish = answeredQuestions >= cardLimit;
          console.log('Simulated Test - Preguntas respondidas:', {
            answeredQuestions,
            cardLimit,
            shouldFinish
          });
          break;

        default:
          console.warn(`Tipo de sesión no reconocido: ${session.studyMethod}`);
          return false;
      }

      if (shouldFinish) {
        console.log(`Finalizando sesión ${sessionId} automáticamente - ${session.studyMethod}`);
        await this.finishSession(sessionId, userId);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error verificando completitud de sesión ${sessionId}:`, error);
      return false;
    }
  }

  // SIMULATED TEST METHODS
  async getTestQuestion(sessionId: number, userId: number) {
    try {
      // Verificar que la sesión existe y no ha finalizado
      const session = await this.validateTestSession(sessionId, userId);

      // Obtener la configuración del test con preguntas y respuestas
      const testConfig = await this.prisma.sessionSimulatedTest.findUnique({
        where: { sessionId },
        include: {
          testQuestions: {
            select: {
              questionId: true,
              cardId: true,
              userAnswer: true
            }
          }
        }
      });

      if (!testConfig) {
        throw new NotFoundException('Configuración del test no encontrada');
      }

      // Obtener el número de preguntas RESPONDIDAS (no solo creadas)
      const answeredQuestions = testConfig.testQuestions.filter(q => q.userAnswer !== null).length;
      // Verificar si hay alguna pregunta creada pero no respondida aún
      const pendingQuestion = testConfig.testQuestions.find(q => q.userAnswer === null);

      // Verificar si ya se han respondido todas las preguntas configuradas
      if (answeredQuestions >= testConfig.numQuestions) {
        return null;
      }


      if (pendingQuestion) {
        // Obtener la pregunta completa con su carta correcta
        const fullQuestion = await this.prisma.testQuestion.findUnique({
          where: { questionId: pendingQuestion.questionId },
          include: {
            correctCard: {
              include: {
                activeRecall: true,
                cornell: true,
                visualCard: true
              }
            }
          }
        });

        if (!fullQuestion) {
          throw new NotFoundException(`Pregunta ${pendingQuestion.questionId} no encontrada`);
        }

        // Obtener todas las cartas necesarias para las opciones
        const allCards = await this.prisma.card.findMany({
          where: {
            deckId: session.deckId,
            learningMethod: { in: session.learningMethod }
          },
          include: {
            activeRecall: true,
            cornell: true,
            visualCard: true
          }
        });

        // Preparar las opciones en el orden correcto
        const options: { cardId: any; content: string; type: any }[] = [];
        for (let i = 0; i < fullQuestion.optionsOrder.length; i++) {
          const optionIndex = fullQuestion.optionsOrder[i];
          let card;

          if (optionIndex === 0) {
            // La opción 0 siempre es la carta correcta
            card = fullQuestion.correctCard;
          } else {
            // Para las demás opciones, usamos otras cartas diferentes a la correcta
            const otherCards = allCards.filter(c => c.cardId !== fullQuestion.cardId);

            // Si no hay suficientes cartas, usamos la misma carta (esto no debería ocurrir)
            if (otherCards.length < optionIndex) {
              card = otherCards[0] || fullQuestion.correctCard;
            } else {
              card = otherCards[optionIndex - 1];
            }
          }

          options.push({
            cardId: card.cardId,
            content: this.getCardContent(card),
            type: card.learningMethod
          });
        }

        // Devolver la pregunta pendiente con sus opciones reconstruidas
        return {
          questionId: fullQuestion.questionId,
          title: fullQuestion.correctCard.title,
          options,
          progress: {
            current: answeredQuestions + 1,
            total: testConfig.numQuestions
          }
        };
      }

      // Si el número de preguntas ya creadas alcanzó el límite pero no todas están respondidas,
      if (testConfig.testQuestions.length >= testConfig.numQuestions) {
        await this.finishSession(sessionId, userId);
        return null;
      }

      // Obtener cartas usadas como preguntas para evitar repetición
      const usedCardIds = testConfig.testQuestions.map(q => q.cardId);

      // Obtener cartas disponibles para nuevas preguntas
      const availableCardsForQuestion = await this.prisma.card.findMany({
        where: {
          deckId: session.deckId,
          learningMethod: { in: session.learningMethod },
          NOT: { cardId: { in: usedCardIds } }
        },
        include: {
          activeRecall: true,
          cornell: true,
          visualCard: true
        }
      });

      // Filtrar cartas con contenido válido para preguntas
      const validQuestionCards = availableCardsForQuestion.filter(card => {
        try {
          const content = this.getCardContent(card);
          return !!content &&
            content !== 'Error getting content' &&
            content !== 'No content available' &&
            content !== 'Unknown card type';
        } catch (e) {
          return false;
        }
      });

      // Si no hay cartas válidas disponibles
      if (validQuestionCards.length === 0) {

        // Si ya se respondió al menos una pregunta, ajustar el número total al respondido
        if (answeredQuestions > 0) {
          await this.prisma.sessionSimulatedTest.update({
            where: { sessionId },
            data: { numQuestions: answeredQuestions }
          });
        }

        await this.finishSession(sessionId, userId);
        return null;
      }

      // Seleccionar carta correcta aleatoriamente
      const correctCard = validQuestionCards[Math.floor(Math.random() * validQuestionCards.length)];

      // Obtener cartas para opciones incorrectas
      const allAvailableCards = await this.prisma.card.findMany({
        where: {
          deckId: session.deckId,
          learningMethod: { in: session.learningMethod },
          NOT: { cardId: correctCard.cardId }  // Excluir solo la carta correcta actual
        },
        include: {
          activeRecall: true,
          cornell: true,
          visualCard: true
        }
      });

      // Filtrar opciones con contenido válido
      const validOptionCards = allAvailableCards.filter(card => {
        try {
          const content = this.getCardContent(card);
          return !!content &&
            content !== 'Error getting content' &&
            content !== 'No content available' &&
            content !== 'Unknown card type';
        } catch (e) {
          return false;
        }
      });

      // Crear pregunta según cantidad de opciones disponibles
      let testQuestion, options;

      if (validOptionCards.length < 2) {
        // Caso con pocas opciones
        const numOptions = validOptionCards.length + 1; // +1 por la correcta
        const incorrectCards = this.shuffleArray(validOptionCards);
        const optionsOrder = this.shuffleArray(Array.from({ length: numOptions }, (_, i) => i));

        // Crear pregunta
        testQuestion = await this.prisma.testQuestion.create({
          data: {
            testId: sessionId,
            cardId: correctCard.cardId,
            optionsOrder
          }
        });

        // Preparar opciones
        options = [];
        for (let i = 0; i < optionsOrder.length; i++) {
          const index = optionsOrder[i];
          const card = index === 0 ? correctCard : incorrectCards[index - 1];
          options.push({
            cardId: card.cardId,
            content: this.getCardContent(card),
            type: card.learningMethod
          });
        }
      } else {
        // Caso normal con suficientes opciones
        const incorrectCards = this.shuffleArray(validOptionCards).slice(0, 2);

        // Crear pregunta con 3 opciones
        testQuestion = await this.prisma.testQuestion.create({
          data: {
            testId: sessionId,
            cardId: correctCard.cardId,
            optionsOrder: this.shuffleArray([0, 1, 2])
          }
        });

        // Preparar opciones
        const allCards = [correctCard, ...incorrectCards];
        options = [];

        for (let i = 0; i < testQuestion.optionsOrder.length; i++) {
          const index = testQuestion.optionsOrder[i];
          options.push({
            cardId: allCards[index].cardId,
            content: this.getCardContent(allCards[index]),
            type: allCards[index].learningMethod
          });
        }
      }

      // Contar preguntas respondidas para el progreso
      // Esto asegura que la numeración comience en 1 para la primera pregunta
      return {
        questionId: testQuestion.questionId,
        title: correctCard.title,
        options,
        progress: {
          current: answeredQuestions + 1, // CORRECCIÓN: Usamos preguntas respondidas + 1
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
      include: {
        testQuestions: {
          select: {
            questionId: true,
            userAnswer: true,
            isCorrect: true
          }
        }
      }
    });

    if (!testConfig) {
      throw new NotFoundException('Configuración del test no encontrada');
    }

    const answeredQuestions = testConfig.testQuestions.filter(q => q.userAnswer !== null).length;

    return {
      totalQuestions: testConfig.numQuestions,
      answeredQuestions: answeredQuestions,
      correctAnswers: testConfig.correctAnswers || 0,
      incorrectAnswers: testConfig.incorrectAnswers || 0,
      remainingTime: this.calculateRemainingTime(session.startTime, testConfig.testDurationMin),
      isComplete: !!session.endTime
    };
  }

  async getTestResult(sessionId: number, userId: number): Promise<TestResultDto> {
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

    // Verificar si los contadores son null o están desactualizados
    if (!session.simulatedTest.correctAnswers && !session.simulatedTest.incorrectAnswers) {
      // Recalcular las estadísticas basadas en las preguntas
      const correctAnswers = session.simulatedTest.testQuestions.filter(q => q.isCorrect).length;
      const incorrectAnswers = session.simulatedTest.testQuestions.filter(q => q.userAnswer !== null && !q.isCorrect).length;

      // Actualizar las estadísticas del test
      await this.prisma.sessionSimulatedTest.update({
        where: { sessionId },
        data: {
          correctAnswers,
          incorrectAnswers
        }
      });

      // Actualizar los valores en el objeto de sesión
      session.simulatedTest.correctAnswers = correctAnswers;
      session.simulatedTest.incorrectAnswers = incorrectAnswers;
    }

    // Calcular puntuación
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
      // Verificar que es una sesión de test válida
      const session = await this.validateTestSession(sessionId, userId);

      // Obtener la pregunta con todas las cartas involucradas
      const testQuestion = await this.prisma.testQuestion.findUnique({
        where: { questionId: answerDto.questionId },
        include: {
          correctCard: true,
          test: {
            include: {
              session: {
                include: {
                  deck: {
                    include: {
                      cards: {
                        where: {
                          learningMethod: {
                            in: session.learningMethod
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!testQuestion) {
        throw new NotFoundException(`Pregunta con ID ${answerDto.questionId} no encontrada`);
      }

      // VALIDACIÓN: Verificar si la pregunta ya fue respondida
      if (testQuestion.userAnswer !== null) {
        console.warn(`Pregunta ${answerDto.questionId} ya fue respondida`);
        return {
          isCorrect: testQuestion.isCorrect,
          correctCardId: testQuestion.cardId,
          selectedIndex: answerDto.selectedOptionIndex,
          optionsOrder: testQuestion.optionsOrder,
          alreadyAnswered: true
        };
      }

      // VALIDACIÓN CRÍTICA: Verificar formato de optionsOrder
      if (!testQuestion.optionsOrder || !Array.isArray(testQuestion.optionsOrder)) {
        console.error(`Error crítico: optionsOrder inválido:`, testQuestion.optionsOrder);
        throw new BadRequestException('Configuración de pregunta inválida - optionsOrder no es un array');
      }

      // VALIDACIÓN: Verificar que selectedOptionIndex es válido
      if (answerDto.selectedOptionIndex === undefined || answerDto.selectedOptionIndex === null) {
        throw new BadRequestException('selectedOptionIndex es requerido');
      }

      if (answerDto.selectedOptionIndex < 0 || answerDto.selectedOptionIndex >= testQuestion.optionsOrder.length) {
        console.error(`Índice seleccionado fuera de rango:`, {
          selectedIndex: answerDto.selectedOptionIndex,
          optionsLength: testQuestion.optionsOrder.length,
          optionsOrder: testQuestion.optionsOrder
        });
        throw new BadRequestException(`Índice de opción inválido: ${answerDto.selectedOptionIndex}. Debe estar entre 0 y ${testQuestion.optionsOrder.length - 1}`);
      }

      const selectedOptionIndex = answerDto.selectedOptionIndex;
      const selectedValue = testQuestion.optionsOrder[selectedOptionIndex];
      const isCorrect = selectedValue === 0;

      // OBTENER EL CARDID DE LA OPCIÓN SELECCIONADA
      const availableCards = testQuestion.test.session.deck.cards;
      let selectedCardId: number;

      if (selectedValue === 0) {
        // Respuesta correcta - usar la carta correcta
        selectedCardId = testQuestion.cardId;
      } else {
        // Respuesta incorrecta - necesitamos encontrar la carta correspondiente
        // Filtrar las cartas incorrectas (excluyendo la correcta)
        const incorrectCards = availableCards.filter(card => card.cardId !== testQuestion.cardId);

        if (selectedValue - 1 < incorrectCards.length) {
          selectedCardId = incorrectCards[selectedValue - 1].cardId;
        } else {
          throw new BadRequestException('Opción seleccionada no válida');
        }
      }

      // Validar timeSpent
      const timeSpent = Math.max(1, answerDto.timeSpent || 1);

      // Usar transacción para atomicidad
      const result = await this.prisma.$transaction(async (tx) => {

        // Verificar de nuevo que la pregunta no fue respondida (race condition)
        const currentQuestion = await tx.testQuestion.findUnique({
          where: { questionId: testQuestion.questionId },
          select: { userAnswer: true }
        });

        if (!currentQuestion) {
          throw new NotFoundException('La pregunta no fue encontrada durante la transacción');
        }

        if (currentQuestion.userAnswer !== null) {
          throw new BadRequestException('La pregunta ya fue respondida por otro proceso');
        }

        await tx.testQuestion.update({
          where: { questionId: testQuestion.questionId },
          data: {
            userAnswer: selectedCardId, // Usar cardId válido
            isCorrect,
            timeSpent
          }
        });

        // Obtener estadísticas actuales del test
        const testStats = await tx.sessionSimulatedTest.findUnique({
          where: { sessionId },
          select: { correctAnswers: true, incorrectAnswers: true }
        });

        if (!testStats) {
          throw new NotFoundException('Configuración del test no encontrada');
        }

        // Inicializar con valores por defecto si son null
        const currentCorrect = testStats.correctAnswers ?? 0;
        const currentIncorrect = testStats.incorrectAnswers ?? 0;

        // Calcular nuevas estadísticas
        const newCorrect = currentCorrect + (isCorrect ? 1 : 0);
        const newIncorrect = currentIncorrect + (isCorrect ? 0 : 1);

        // Actualizar estadísticas del test
        await tx.sessionSimulatedTest.update({
          where: { sessionId },
          data: {
            correctAnswers: newCorrect,
            incorrectAnswers: newIncorrect
          }
        });

        return {
          isCorrect,
          correctCardId: testQuestion.cardId,
          selectedIndex: selectedOptionIndex,
          selectedCardId,
          optionsOrder: testQuestion.optionsOrder,
          alreadyAnswered: false
        };
      });

      return result;

    } catch (error) {
      console.error('=== ERROR en evaluateTestAnswer ===');
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);

      if (error instanceof BadRequestException ||
        error instanceof NotFoundException) {
        throw error;
      }

      // Para errores inesperados, log más detallado
      console.error('Error inesperado:', {
        type: typeof error,
        name: error?.constructor?.name,
        message: error?.message,
        answerDto,
        sessionId,
        userId
      });

      throw new Error(`Error procesando respuesta: ${error?.message || 'Error desconocido'}`);
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

  // POMODORO METHODS:

  async getPomodoroNextCard(sessionId: number, userId: number) {
    try {
      const session = await this.findOne(sessionId, userId);

      if (!session || session.endTime) {
        throw new NotFoundException('Sesión no encontrada o ya finalizada');
      }

      if (session.studyMethod !== StudyMethod.pomodoro) {
        throw new BadRequestException('Esta sesión no es de tipo Pomodoro');
      }

      // Verificar si estamos en descanso
      const pomodoroConfig = await this.prisma.sessionPomodoro.findUnique({
        where: { sessionId }
      });

      if (!pomodoroConfig) {
        throw new NotFoundException('Configuración Pomodoro no encontrada');
      }

      if (pomodoroConfig.isOnBreak) {
        throw new BadRequestException('La sesión está en descanso. Finaliza el descanso para continuar estudiando.');
      }

      // Verificar si debemos iniciar un descanso por tiempo de estudio
      await this.checkPomodoroStudyTime(sessionId, pomodoroConfig);

      // Obtener todas las cartas disponibles del deck para esta sesión
      const allAvailableCards = await this.prisma.card.findMany({
        where: {
          deckId: session.deckId,
          learningMethod: {
            in: session.learningMethod
          }
        },
        include: {
          activeRecall: true,
          cornell: true,
          visualCard: true
        }
      });

      if (allAvailableCards.length === 0) {
        throw new BadRequestException('No hay cartas disponibles para esta sesión');
      }

      this.logger.debug(`Pomodoro: Total cartas disponibles: ${allAvailableCards.length}`);

      // Obtener todas las revisiones de la sesión actual
      const allReviews = await this.prisma.cardReview.findMany({
        where: {
          sessionId,
          userId
        },
        orderBy: {
          reviewedAt: 'desc'
        }
      });

      this.logger.debug(`Pomodoro: Total revisiones: ${allReviews.length}`);

      // NUEVA LÓGICA PARA POMODORO:
      // En lugar de usar memorización espaciada estricta, usar un enfoque más balanceado

      // 1. Obtener cartas no vistas primero (prioridad alta)
      const reviewedCardIds = allReviews.map(review => review.cardId);
      const unviewedCards = allAvailableCards.filter(card =>
        !reviewedCardIds.includes(card.cardId)
      );

      this.logger.debug(`Pomodoro: Cartas no vistas: ${unviewedCards.length}`);

      if (unviewedCards.length > 0) {
        // Seleccionar una carta aleatoria de las no vistas
        const randomCard = unviewedCards[Math.floor(Math.random() * unviewedCards.length)];
        this.logger.debug(`Pomodoro: Devolviendo carta no vista. CardId: ${randomCard.cardId}`);
        return randomCard;
      }

      // 2. Si todas las cartas han sido vistas, usar lógica inteligente de repetición
      // Evitar mostrar la misma carta consecutivamente

      // Obtener las últimas 2-3 cartas para evitar repetición inmediata
      const recentCardIds = allReviews.slice(0, Math.min(3, allReviews.length)).map(r => r.cardId);
      
      // Filtrar cartas para evitar las recientes
      let availableForRepeat = allAvailableCards;
      if (recentCardIds.length > 0 && allAvailableCards.length > recentCardIds.length) {
        availableForRepeat = allAvailableCards.filter(card => 
          !recentCardIds.includes(card.cardId)
        );
      }

      // Si después del filtro no quedan cartas suficientes, usar todas menos la última
      if (availableForRepeat.length === 0) {
        const lastCardId = allReviews.length > 0 ? allReviews[0].cardId : null;
        if (lastCardId && allAvailableCards.length > 1) {
          availableForRepeat = allAvailableCards.filter(card => card.cardId !== lastCardId);
        } else {
          availableForRepeat = allAvailableCards;
        }
      }

      // 3. Dentro de las cartas disponibles, dar ligera prioridad a las que necesitan revisión
      // pero sin quedarse atrapado en una sola carta
      const now = new Date();
      const cardsNeedingReview = await this.prisma.cardReview.findMany({
        where: {
          sessionId,
          userId,
          cardId: { in: availableForRepeat.map(c => c.cardId) },
          nextReviewAt: { lte: now }
        },
        include: {
          card: {
            include: {
              activeRecall: true,
              cornell: true,
              visualCard: true
            }
          }
        },
        orderBy: {
          nextReviewAt: 'asc'
        }
      });

      // Si hay cartas que necesitan revisión Y no son las recientes, considerarlas con 70% de probabilidad
      if (cardsNeedingReview.length > 0 && Math.random() < 0.7) {
        // Pero limitar cuántas veces seguidas se puede mostrar la misma carta que necesita revisión
        const lastFewReviews = allReviews.slice(0, 3);
        const cardCounts = lastFewReviews.reduce((acc, review) => {
          acc[review.cardId] = (acc[review.cardId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        // Filtrar cartas que no se han mostrado demasiado recientemente
        const cardsNotOverused = cardsNeedingReview.filter(review => 
          (cardCounts[review.cardId] || 0) < 2 // No más de 2 veces en las últimas 3
        );

        if (cardsNotOverused.length > 0) {
          const selectedReview = cardsNotOverused[0]; // Tomar la primera (más antigua)
          this.logger.debug(`Pomodoro: Devolviendo carta que necesita revisión (controlada). CardId: ${selectedReview.card.cardId}`);
          return selectedReview.card;
        }
      }

      // 4. Si no hay cartas que necesiten revisión o se aplicó el filtro de sobreuso,
      // seleccionar aleatoriamente de las disponibles
      const randomCard = availableForRepeat[Math.floor(Math.random() * availableForRepeat.length)];

      this.logger.debug(`Pomodoro: Repitiendo cartas aleatoriamente. Evitando recientes: [${recentCardIds.join(', ')}]. Seleccionada: ${randomCard.cardId}`);

      return randomCard;

    } catch (error) {
      this.logger.error(`Error en getPomodoroNextCard: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getPomodoroProgress(sessionId: number, userId: number) {
    const session = await this.findOne(sessionId, userId);

    if (session.studyMethod !== StudyMethod.pomodoro) {
      throw new BadRequestException('Esta sesión no es de tipo Pomodoro');
    }

    const pomodoroConfig = await this.prisma.sessionPomodoro.findUnique({
      where: { sessionId }
    });

    if (!pomodoroConfig) {
      throw new NotFoundException('Configuración Pomodoro no encontrada');
    }

    const reviews = await this.prisma.cardReview.findMany({
      where: {
        sessionId,
        userId
      }
    });

    const totalCards = session.deck.cards.length;
    const reviewedCards = reviews.length;
    const uniqueCardsReviewed = new Set(reviews.map(r => r.cardId)).size;

    // Calcular tiempo transcurrido en estudio (excluyendo descansos) EN TIEMPO REAL
    const now = new Date();
    let studyTimeElapsed = pomodoroConfig.totalStudyTimeMin;

    if (pomodoroConfig.studyStartTime && !pomodoroConfig.isOnBreak) {
      const currentStudyTime = Math.floor((now.getTime() - pomodoroConfig.studyStartTime.getTime()) / 60000);
      studyTimeElapsed += currentStudyTime;
    }

    // Calcular tiempo de descanso transcurrido EN TIEMPO REAL
    let breakTimeElapsed = pomodoroConfig.totalBreakTimeMin;

    if (pomodoroConfig.breakStartTime && pomodoroConfig.isOnBreak) {
      const currentBreakTime = Math.floor((now.getTime() - pomodoroConfig.breakStartTime.getTime()) / 60000);
      breakTimeElapsed += currentBreakTime;
    }

    return {
      currentCycle: pomodoroConfig.currentCycle,
      isOnBreak: pomodoroConfig.isOnBreak,
      studyTimeElapsed, // en minutos - actualizado en tiempo real
      breakTimeElapsed, // en minutos - actualizado en tiempo real
      studyTimeTarget: pomodoroConfig.studyMinutes,
      breakTimeTarget: pomodoroConfig.restMinutes,
      totalCards,
      reviewedCards,
      uniqueCardsReviewed,
      cardsTarget: pomodoroConfig.numCards
    };
  }

  async evaluateCard(sessionId: number, cardId: number, evaluation: string, userId: number) {
    const session = await this.findOne(sessionId, userId);

    if (!session || session.endTime) {
      throw new NotFoundException('Sesión no encontrada o ya finalizada');
    }

    // Verificar que la carta pertenece al deck de la sesión
    const card = await this.prisma.card.findFirst({
      where: {
        cardId,
        deckId: session.deckId
      }
    });

    if (!card) {
      throw new NotFoundException('Carta no encontrada en este deck');
    }

    // Calcular el próximo intervalo basado en la evaluación
    const intervals = this.getSpacedRepetitionIntervals(evaluation);
    const nextReviewAt = new Date(Date.now() + intervals.minutes * 60 * 1000);

    // Crear la revisión de la carta
    const cardReview = await this.prisma.cardReview.create({
      data: {
        sessionId,
        cardId,
        userId,
        evaluation: evaluation as any, // Cast to Evaluation enum
        reviewedAt: new Date(),
        nextReviewAt,
        intervalMinutes: intervals.minutes
      }
    });

    return {
      success: true,
      cardReview,
      nextReviewAt,
      intervalMinutes: intervals.minutes
    };
  }

  private getSpacedRepetitionIntervals(evaluation: string) {
    switch (evaluation) {
      case 'dificil':
        return { minutes: 1 }; // Revisar en 1 minuto
      case 'masomenos':
        return { minutes: 5 }; // Revisar en 5 minutos
      case 'bien':
        return { minutes: 15 }; // Revisar en 15 minutos
      case 'facil':
        return { minutes: 30 }; // Revisar en 30 minutos
      default:
        return { minutes: 5 }; // Default a 5 minutos
    }
  }

  /**
   * Inicia un descanso en la sesión Pomodoro
   */
  async startPomodoroBreak(sessionId: number, userId: number) {
    const session = await this.findOne(sessionId, userId);

    if (session.studyMethod !== StudyMethod.pomodoro) {
      throw new BadRequestException('Esta sesión no es de tipo Pomodoro');
    }

    const pomodoroConfig = await this.prisma.sessionPomodoro.findUnique({
      where: { sessionId }
    });

    if (!pomodoroConfig) {
      throw new NotFoundException('Configuración Pomodoro no encontrada');
    }

    if (pomodoroConfig.isOnBreak) {
      throw new BadRequestException('La sesión ya está en descanso');
    }

    const now = new Date();
    let totalStudyTimeMin = pomodoroConfig.totalStudyTimeMin;

    // Si había un tiempo de estudio activo, calcularlo y agregarlo al total
    if (pomodoroConfig.studyStartTime) {
      const studyTimeElapsed = Math.floor((now.getTime() - pomodoroConfig.studyStartTime.getTime()) / 60000);
      totalStudyTimeMin += studyTimeElapsed;
    }

    // Actualizar a estado de descanso
    const updatedConfig = await this.prisma.sessionPomodoro.update({
      where: { sessionId },
      data: {
        isOnBreak: true,
        breakStartTime: now,
        studyStartTime: null, // Limpiar el tiempo de estudio
        totalStudyTimeMin // Actualizar el tiempo total de estudio
      }
    });

    this.logger.debug(`Pomodoro: Iniciando descanso. Tiempo de estudio acumulado: ${totalStudyTimeMin}min`);

    return {
      success: true,
      isOnBreak: true,
      breakStartTime: now,
      totalStudyTimeMin
    };
  }

  /**
   * Finaliza un descanso en la sesión Pomodoro
   */
  async endPomodoroBreak(sessionId: number, userId: number) {
    const session = await this.findOne(sessionId, userId);

    if (session.studyMethod !== StudyMethod.pomodoro) {
      throw new BadRequestException('Esta sesión no es de tipo Pomodoro');
    }

    const pomodoroConfig = await this.prisma.sessionPomodoro.findUnique({
      where: { sessionId }
    });

    if (!pomodoroConfig) {
      throw new NotFoundException('Configuración Pomodoro no encontrada');
    }

    if (!pomodoroConfig.isOnBreak) {
      throw new BadRequestException('La sesión no está en descanso');
    }

    const now = new Date();
    let totalBreakTimeMin = pomodoroConfig.totalBreakTimeMin;

    // Calcular el tiempo de descanso transcurrido
    if (pomodoroConfig.breakStartTime) {
      const breakTimeElapsed = Math.floor((now.getTime() - pomodoroConfig.breakStartTime.getTime()) / 60000);
      totalBreakTimeMin += breakTimeElapsed;
      
      this.logger.debug(`End break: Break time elapsed: ${breakTimeElapsed}min, Total break time: ${totalBreakTimeMin}min`);
    }

    // Actualizar a estado de estudio y incrementar ciclo
    const updatedConfig = await this.prisma.sessionPomodoro.update({
      where: { sessionId },
      data: {
        isOnBreak: false,
        breakStartTime: null, // Limpiar el tiempo de descanso
        studyStartTime: now, // Iniciar nuevo tiempo de estudio
        totalBreakTimeMin, // Actualizar el tiempo total de descanso
        currentCycle: pomodoroConfig.currentCycle + 1 // Incrementar ciclo
      }
    });

    this.logger.debug(`Pomodoro: Finalizando descanso. Tiempo de descanso acumulado: ${totalBreakTimeMin}min. Nuevo ciclo: ${updatedConfig.currentCycle}`);

    return {
      success: true,
      isOnBreak: false,
      studyStartTime: now,
      totalBreakTimeMin,
      currentCycle: updatedConfig.currentCycle
    };
  }

  /**
   * Obtiene el estado actual de la sesión Pomodoro
   */
  async getPomodoroStatus(sessionId: number, userId: number) {
    const session = await this.findOne(sessionId, userId);

    if (session.studyMethod !== StudyMethod.pomodoro) {
      throw new BadRequestException('Esta sesión no es de tipo Pomodoro');
    }

    const pomodoroConfig = await this.prisma.sessionPomodoro.findUnique({
      where: { sessionId }
    });

    if (!pomodoroConfig) {
      throw new NotFoundException('Configuración Pomodoro no encontrada');
    }

    const now = new Date();
    let timeRemaining = 0;
    let currentPhase = 'not_started';

    if (pomodoroConfig.isOnBreak && pomodoroConfig.breakStartTime) {
      // Calculamos tiempo restante de descanso
      const breakElapsed = Math.floor((now.getTime() - pomodoroConfig.breakStartTime.getTime()) / 1000); // en SEGUNDOS
      const breakDurationSeconds = pomodoroConfig.restMinutes * 60;
      timeRemaining = Math.max(0, breakDurationSeconds - breakElapsed); // en SEGUNDOS
      currentPhase = 'break';
      
      this.logger.debug(`Pomodoro Status - Break: elapsed=${breakElapsed}s, duration=${breakDurationSeconds}s, remaining=${timeRemaining}s`);
    } else if (pomodoroConfig.studyStartTime) {
      // Calculamos tiempo restante de estudio
      const studyElapsed = Math.floor((now.getTime() - pomodoroConfig.studyStartTime.getTime()) / 1000); // en SEGUNDOS
      const studyDurationSeconds = pomodoroConfig.studyMinutes * 60;
      timeRemaining = Math.max(0, studyDurationSeconds - studyElapsed); // en SEGUNDOS
      currentPhase = 'study';
      
      this.logger.debug(`Pomodoro Status - Study: elapsed=${studyElapsed}s, duration=${studyDurationSeconds}s, remaining=${timeRemaining}s`);
    } else {
      currentPhase = 'not_started';
      timeRemaining = pomodoroConfig.studyMinutes * 60; // en SEGUNDOS
    }

    return {
      sessionId,
      currentCycle: pomodoroConfig.currentCycle,
      currentPhase,
      isOnBreak: pomodoroConfig.isOnBreak,
      timeRemaining, // en SEGUNDOS ahora
      studyDuration: pomodoroConfig.studyMinutes,
      breakDuration: pomodoroConfig.restMinutes,
      totalStudyTime: pomodoroConfig.totalStudyTimeMin,
      totalBreakTime: pomodoroConfig.totalBreakTimeMin
    };
  }

  /**
   * Verifica si debe iniciar un descanso automáticamente por tiempo de estudio
   */
  private async checkPomodoroStudyTime(sessionId: number, pomodoroConfig: any) {
    if (!pomodoroConfig.studyStartTime || pomodoroConfig.isOnBreak) {
      return;
    }

    const now = new Date();
    const studyTimeElapsed = Math.floor((now.getTime() - pomodoroConfig.studyStartTime.getTime()) / 60000);

    // Si ha pasado el tiempo de estudio configurado, iniciar descanso automáticamente
    if (studyTimeElapsed >= pomodoroConfig.studyMinutes) {
      this.logger.debug(`Pomodoro: Tiempo de estudio completado automáticamente (${studyTimeElapsed}/${pomodoroConfig.studyMinutes}min)`);
      
      // Calcular el tiempo total de estudio incluyendo el tiempo actual
      const totalStudyTimeMin = pomodoroConfig.totalStudyTimeMin + studyTimeElapsed;

      // Actualizar los tiempos antes de forzar el descanso
      await this.prisma.sessionPomodoro.update({
        where: { sessionId },
        data: {
          isOnBreak: true,
          breakStartTime: now,
          studyStartTime: null,
          totalStudyTimeMin
        }
      });

      throw new BadRequestException('Tiempo de estudio completado. Inicia tu descanso.');
    }
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
        throw new NotFoundException(`Sesión ${sessionId} no encontrada o no pertenece al usuario`);
      }

      // Si ya está finalizada, simplemente devolver la sesión
      if (session.endTime) {
        return session;
      }

      // Calcular la duración en minutos
      const endTime = new Date();
      const durationMs = endTime.getTime() - session.startTime.getTime();
      const minDuration = Math.round(durationMs / (1000 * 60)); // Convertir de ms a minutos

      // Para sesiones de test simulado, asegurar que las estadísticas están actualizadas
      if (session.studyMethod === StudyMethod.simulatedTest && session.simulatedTest) {
        // Recalcular estadísticas basadas en las preguntas
        const correctAnswers = session.simulatedTest.testQuestions.filter(q => q.isCorrect).length;
        const incorrectAnswers = session.simulatedTest.testQuestions.filter(q => q.userAnswer !== null && !q.isCorrect).length;

        // Actualizar las estadísticas del test
        await this.prisma.sessionSimulatedTest.update({
          where: { sessionId },
          data: {
            correctAnswers,
            incorrectAnswers
          }
        });
      }

      // Finalizar la sesión con endTime y minDuration
      const updatedSession = await this.prisma.studySession.update({
        where: { sessionId },
        data: {
          endTime: endTime,
          minDuration: minDuration
        }
      });

      return updatedSession;
    } catch (error) {
      console.error(`Error finalizando sesión ${sessionId}:`, error);
      throw error;
    }
  }
}