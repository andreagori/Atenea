import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TimeRangeDto, DeckAnalyticsDto } from './dto/create-analytics.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) { }

  // 1. Tiempo de estudio diario - Line chart
  async getDailyStudyTime(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 7) * 24 * 60 * 60 * 1000)); // Default to 7 days if undefined

    const sessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        },
        endTime: { not: null } // Solo sesiones completadas
      },
      include: {
        pomodoro: true
      }
    });

    // Agrupar por fecha y calcular minutos totales
    const dailyData = sessions.reduce((acc, session) => {
      const date = session.startTime.toISOString().split('T')[0];

      let minutes = 0;
      if (session.studyMethod === 'pomodoro' && session.pomodoro) {
        minutes = session.pomodoro.totalStudyTimeMin;
      } else if (session.minDuration) {
        minutes = session.minDuration;
      }

      acc[date] = (acc[date] || 0) + minutes;
      return acc;
    }, {} as Record<string, number>);

    // Llenar días sin actividad con 0
    const result: { date: string; minutes: number; hours: number }[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        minutes: dailyData[dateStr] || 0,
        hours: Math.round((dailyData[dateStr] || 0) / 60 * 100) / 100
      });
    }

    return result;
  }

  // 2. Puntuaciones en tests - Bar chart
  async getTestScores(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 7) * 24 * 60 * 60 * 1000)); // Default to 7 days if undefined

    const results = await this.prisma.sessionsResult.findMany({
      where: {
        testDate: {
          gte: startDate,
          lte: endDate
        },
        session: {
          userId
        }
      },
      include: {
        session: {
          include: {
            deck: {
              select: { title: true }
            }
          }
        }
      },
      orderBy: {
        testDate: 'asc'
      }
    });

    return results.map(result => ({
      date: result.testDate.toISOString().split('T')[0],
      score: result.score,
      deckTitle: result.session.deck.title,
      sessionId: result.sessionId
    }));
  }

  // 3. Distribución de métodos - Pie chart
  async getMethodsDistribution(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 7) * 24 * 60 * 60 * 1000)); // Default to 7 days if undefined

    const sessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Distribución de métodos de estudio
    const studyMethods = sessions.reduce((acc, session) => {
      acc[session.studyMethod] = (acc[session.studyMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cards = await this.prisma.card.findMany({
      where: {
        deck: { userId: userId }
      },
      select: {
        learningMethod: true
      }
    });

    // Contar cartas por learningMethod
    const learningMethods = cards.reduce((acc, card) => {
      acc[card.learningMethod] = (acc[card.learningMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      studyMethods: Object.entries(studyMethods).map(([method, count]) => ({
        method,
        count,
        percentage: sessions.length > 0 ? Math.round((count / sessions.length) * 100) : 0
      })),
      learningMethods: Object.entries(learningMethods).map(([method, count]) => ({
        method,
        count,
        percentage: cards.length > 0 ? Math.round((count / cards.length) * 100) : 0
      }))
    };
  }

  // 4. Calendario de actividad - Heatmap
  async getActivityCalendar(userId: number, year: number = new Date().getFullYear()) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const sessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        },
        endTime: { not: null }
      },
      include: {
        pomodoro: true
      }
    });

    const activityMap = sessions.reduce((acc, session) => {
      const date = session.startTime.toISOString().split('T')[0];

      let minutes = 0;
      if (session.studyMethod === 'pomodoro' && session.pomodoro) {
        minutes = session.pomodoro.totalStudyTimeMin;
      } else if (session.minDuration) {
        minutes = session.minDuration;
      }

      if (!acc[date]) {
        acc[date] = { minutes: 0, sessions: 0 };
      }
      acc[date].minutes += minutes;
      acc[date].sessions += 1;

      return acc;
    }, {} as Record<string, { minutes: number, sessions: number }>);

    // Generar todos los días del año
    const calendar: {
      date: string;
      dayOfWeek: number;
      week: number;
      minutes: number;
      sessions: number;
      intensity: number;
    }[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const activity = activityMap[dateStr];

      calendar.push({
        date: dateStr,
        dayOfWeek: d.getDay(),
        week: Math.ceil(d.getDate() / 7),
        minutes: activity?.minutes || 0,
        sessions: activity?.sessions || 0,
        intensity: activity ? Math.min(Math.floor(activity.minutes / 30), 4) : 0 // 0-4 intensity levels
      });
    }

    return calendar;
  }

  // 5. Eficiencia por método - Scatter plot
  async getMethodEfficiency(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 7) * 24 * 60 * 60 * 1000)); // Default to 7 days if undefined

    const sessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        },
        endTime: { not: null }
      },
      include: {
        pomodoro: true,
        sessionResult: true
      }
    });

    return sessions
      .filter(session => session.sessionResult) // Solo sesiones con resultado
      .map(session => {
        let minutes = 0;
        if (session.studyMethod === 'pomodoro' && session.pomodoro) {
          minutes = session.pomodoro.totalStudyTimeMin;
        } else if (session.minDuration) {
          minutes = session.minDuration;
        }

        return {
          studyMethod: session.studyMethod,
          minutes,
          score: session.sessionResult!.score,
          efficiency: minutes > 0 ? Math.round((session.sessionResult!.score / minutes) * 100) / 100 : 0, // puntos por minuto
          sessionId: session.sessionId,
          date: session.startTime.toISOString().split('T')[0]
        };
      });
  }

  // 6. Progreso por deck - Multi-bar chart
  async getDeckProgress(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 7) * 24 * 60 * 60 * 1000)); // Default to 7 days if undefined

    const sessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        deck: true,
        sessionResult: true,
        pomodoro: true
      }
    });

    const deckStats = sessions.reduce((acc, session) => {
      const deckId = session.deckId;
      const deckTitle = session.deck.title;

      if (!acc[deckId]) {
        acc[deckId] = {
          deckTitle,
          totalSessions: 0,
          totalMinutes: 0,
          totalScore: 0,
          testCount: 0,
          averageScore: 0
        };
      }

      acc[deckId].totalSessions += 1;

      // Calcular minutos
      let minutes = 0;
      if (session.studyMethod === 'pomodoro' && session.pomodoro) {
        minutes = session.pomodoro.totalStudyTimeMin;
      } else if (session.minDuration) {
        minutes = session.minDuration;
      }
      acc[deckId].totalMinutes += minutes;

      // Calcular puntuaciones
      if (session.sessionResult) {
        acc[deckId].totalScore += session.sessionResult.score;
        acc[deckId].testCount += 1;
      }

      return acc;
    }, {} as Record<number, any>);

    // Calcular promedios
    return Object.values(deckStats).map(deck => ({
      ...deck,
      averageScore: deck.testCount > 0 ? Math.round(deck.totalScore / deck.testCount) : 0,
      averageMinutesPerSession: deck.totalSessions > 0 ? Math.round(deck.totalMinutes / deck.totalSessions) : 0
    }));
  }

  // 7. Retención de cartas - Line chart con intervalos
  async getCardRetention(userId: number, deckId?: number) {
    const whereClause: any = { userId };
    if (deckId) {
      whereClause.card = { deckId };
    }

    const reviews = await this.prisma.cardReview.findMany({
      where: whereClause,
      include: {
        card: {
          include: {
            deck: {
              select: { title: true }
            }
          }
        }
      },
      orderBy: {
        reviewedAt: 'asc'
      }
    });

    // Agrupar por evaluación y calcular intervalos promedio
    const retentionData = reviews.reduce((acc, review) => {
      const evaluation = review.evaluation;
      const intervalHours = review.intervalMinutes / 60;

      if (!acc[evaluation]) {
        acc[evaluation] = {
          evaluation,
          intervals: [],
          averageInterval: 0,
          count: 0
        };
      }

      acc[evaluation].intervals.push(intervalHours);
      acc[evaluation].count += 1;

      return acc;
    }, {} as Record<string, any>);

    // Calcular promedios
    return Object.values(retentionData).map(data => ({
      ...data,
      averageInterval: data.intervals.reduce((sum: number, interval: number) => sum + interval, 0) / data.count,
      medianInterval: data.intervals.sort((a: number, b: number) => a - b)[Math.floor(data.intervals.length / 2)]
    }));
  }

  // 8. Horas productivas - Radar chart
  async getProductiveHours(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 7) * 24 * 60 * 60 * 1000)); // Default to 7 days if undefined

    const sessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        },
        endTime: { not: null }
      },
      include: {
        pomodoro: true,
        sessionResult: true
      }
    });

    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      sessions: 0,
      totalMinutes: 0,
      totalScore: 0,
      testCount: 0,
      averageScore: 0,
      productivity: 0
    }));

    sessions.forEach(session => {
      const hour = session.startTime.getHours();
      hourlyStats[hour].sessions += 1;

      // Calcular minutos
      let minutes = 0;
      if (session.studyMethod === 'pomodoro' && session.pomodoro) {
        minutes = session.pomodoro.totalStudyTimeMin;
      } else if (session.minDuration) {
        minutes = session.minDuration;
      }
      hourlyStats[hour].totalMinutes += minutes;

      // Calcular puntuaciones
      if (session.sessionResult) {
        hourlyStats[hour].totalScore += session.sessionResult.score;
        hourlyStats[hour].testCount += 1;
      }
    });

    // Calcular métricas finales
    return hourlyStats.map(stat => ({
      ...stat,
      averageScore: stat.testCount > 0 ? Math.round(stat.totalScore / stat.testCount) : 0,
      averageMinutes: stat.sessions > 0 ? Math.round(stat.totalMinutes / stat.sessions) : 0,
      productivity: stat.sessions > 0 && stat.testCount > 0
        ? Math.round(((stat.totalScore / stat.testCount) * stat.sessions) / 10) // Métrica compuesta
        : stat.sessions * 2 // Si no hay tests, usar solo cantidad de sesiones
    }));
  }

  async getSessionsPerformance(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 7) * 24 * 60 * 60 * 1000));

    // Obtener solo sesiones de tests simulados
    const simulatedTestSessions = await this.prisma.sessionSimulatedTest.findMany({
      where: {
        session: {
          userId,
          startTime: {
            gte: startDate,
            lte: endDate
          },
          endTime: { not: null }
        }
      },
      include: {
        session: {
          include: {
            deck: {
              select: { title: true }
            }
          }
        },
        testQuestions: {
          include: {
            correctCard: {
              select: {
                cardId: true,
                title: true,
                learningMethod: true
              }
            },
            selectedAnswer: {
              select: {
                cardId: true,
                title: true,
                learningMethod: true
              }
            }
          }
        }
      },
      orderBy: {
        session: {
          startTime: 'desc'
        }
      }
    });

    return simulatedTestSessions.map(testSession => {
      // Para tests simulados, usamos isCorrect para determinar correctas/incorrectas
      const correctCards = testSession.testQuestions
        .filter(question => question.isCorrect === true)
        .map(question => ({
          cardId: question.correctCard.cardId,
          title: question.correctCard.title,
          learningMethod: question.correctCard.learningMethod,
          difficulty: 'correct' as const,
          responseTime: question.timeSpent || 0
        }));

      const incorrectCards = testSession.testQuestions
        .filter(question => question.isCorrect === false)
        .map(question => ({
          cardId: question.correctCard.cardId,
          title: question.correctCard.title,
          learningMethod: question.correctCard.learningMethod,
          difficulty: 'incorrect' as const,
          responseTime: question.timeSpent || 0,
          userAnswer: question.selectedAnswer ? {
            cardId: question.selectedAnswer.cardId,
            title: question.selectedAnswer.title
          } : null
        }));

      const totalCards = testSession.testQuestions.length;
      const scorePercentage = totalCards > 0 
        ? Math.round((correctCards.length / totalCards) * 100) 
        : 0;

      return {
        sessionId: testSession.session.sessionId,
        sessionType: 'Test Simulado',
        sessionDate: testSession.session.startTime.toISOString(),
        deckName: testSession.session.deck.title,
        correctCards,
        incorrectCards,
        totalCards,
        scorePercentage
      };
    });
  }

  async getSpacedRepetitionStats(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 7) * 24 * 60 * 60 * 1000));

    // Buscar sesiones de memorización espaciada
    const sessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        studyMethod: 'spacedRepetition', // Corregido según el schema
        startTime: {
          gte: startDate,
          lte: endDate
        },
        endTime: { not: null }
      },
      include: {
        deck: {
          select: { title: true }
        },
        cardReviews: {
          include: {
            card: {
              select: {
                cardId: true,
                title: true,
                learningMethod: true
              }
            }
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    return sessions.map(session => {
      // Agrupar cartas por dificultad según el schema: dificil, masomenos, bien, facil
      const cardsByDifficulty = {
        facil: session.cardReviews
          .filter(review => review.evaluation === 'facil')
          .map(review => ({
            cardId: review.card.cardId,
            title: review.card.title,
            learningMethod: review.card.learningMethod,
            difficulty: 'facil' as const,
            responseTime: review.timeSpent || 0
          })),
        bien: session.cardReviews
          .filter(review => review.evaluation === 'bien')
          .map(review => ({
            cardId: review.card.cardId,
            title: review.card.title,
            learningMethod: review.card.learningMethod,
            difficulty: 'bien' as const,
            responseTime: review.timeSpent || 0
          })),
        masomenos: session.cardReviews
          .filter(review => review.evaluation === 'masomenos')
          .map(review => ({
            cardId: review.card.cardId,
            title: review.card.title,
            learningMethod: review.card.learningMethod,
            difficulty: 'masomenos' as const,
            responseTime: review.timeSpent || 0
          })),
        dificil: session.cardReviews
          .filter(review => review.evaluation === 'dificil')
          .map(review => ({
            cardId: review.card.cardId,
            title: review.card.title,
            learningMethod: review.card.learningMethod,
            difficulty: 'dificil' as const,
            responseTime: review.timeSpent || 0
          }))
      };

      return {
        sessionId: session.sessionId,
        sessionDate: session.startTime.toISOString(),
        deckName: session.deck.title,
        cardsByDifficulty,
        totalCards: session.cardReviews.length
      };
    });
  }

  // 11. Correlación entre métodos de estudio y notas reales de examen.
  //
  // Para cada examen del usuario en el rango (que tenga deckId asignado),
  // se buscan las sesiones de estudio sobre ese mazo en los 30 días previos
  // al examen, se identifican los pares únicos (studyMethod × learningMethod)
  // usados en esa ventana, y se atribuye la nota del examen a cada par.
  //
  // El resultado es la nota promedio por combinación de método + el tamaño
  // de muestra (cuántos exámenes contribuyeron a ese promedio). El frontend
  // usa sampleSize para decidir cuándo mostrar la combinación (umbral
  // sugerido: ≥3 antes de tratarla como señal).
  //
  // Limitaciones: este endpoint mide correlación, no causalidad. La nota
  // se expresa como porcentaje del máximo del examen para que escalas
  // distintas (10/20, 0/100, etc.) sean comparables.
  async getExamCorrelation(userId: number, timeRange: TimeRangeDto) {
    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 30) * 24 * 60 * 60 * 1000));

    const exams = await this.prisma.exam.findMany({
      where: {
        userId,
        examDate: { gte: startDate, lte: endDate },
        deckId: { not: null }, // solo exámenes correlacionables
      },
    });

    const ATTRIBUTION_DAYS = 30;
    type Key = string; // `${studyMethod}|${learningMethod}`
    const acc = new Map<Key, number[]>();

    for (const exam of exams) {
      const examScorePct = exam.maxScore > 0
        ? (exam.examScore / exam.maxScore) * 100
        : exam.examScore;

      const windowStart = new Date(exam.examDate);
      windowStart.setDate(windowStart.getDate() - ATTRIBUTION_DAYS);

      const sessions = await this.prisma.studySession.findMany({
        where: {
          userId,
          deckId: exam.deckId!,
          startTime: { gte: windowStart, lte: exam.examDate },
          endTime: { not: null },
        },
        select: {
          studyMethod: true,
          learningMethod: true,
        },
      });

      // Una misma sesión puede tener varios learningMethods; cada combo
      // único cuenta como atribución de este examen.
      const combos = new Set<Key>();
      for (const s of sessions) {
        for (const lm of s.learningMethod) {
          combos.add(`${s.studyMethod}|${lm}`);
        }
      }

      for (const k of combos) {
        const list = acc.get(k) ?? [];
        list.push(examScorePct);
        acc.set(k, list);
      }
    }

    return Array.from(acc.entries()).map(([key, scores]) => {
      const [studyMethod, learningMethod] = key.split('|');
      const sum = scores.reduce((a, b) => a + b, 0);
      return {
        studyMethod,
        learningMethod,
        avgExamScore: Math.round((sum / scores.length) * 10) / 10,
        sampleSize: scores.length,
      };
    });
  }

  // 12. Insights — plain-Spanish summaries computed from existing analytics.
  //
  // Rules-based engine (no ML). Each rule emits at most one Insight and only
  // when it has enough data to be useful (see per-rule thresholds below). The
  // panel on /analisis renders whatever is emitted; if nothing emits, the
  // panel shows nothing — better than fabricating insights from thin data.
  //
  // Insight shape mirrors RESEARCH_IMPLEMENTATION_PLAN.md §4 Track 5:
  //   key             — stable identifier for the rule
  //   rq              — research question this insight speaks to
  //   headline        — short, plain Spanish ("Tu mejor método fue X")
  //   detail          — supporting line, includes the numbers
  //   supportingChart — chart key the user can scroll to for more
  //   confidence      — low/medium/high based on sample size
  //   computation     — "¿Cómo se calcula?" tooltip body
  async getInsights(userId: number, timeRange: TimeRangeDto) {
    type Insight = {
      key: string;
      rq: 'RQ1' | 'RQ2' | 'RQ3' | 'RQ4' | 'RQ5' | 'general';
      headline: string;
      detail: string;
      supportingChart?: string;
      confidence: 'low' | 'medium' | 'high';
      computation: string;
    };
    const out: Insight[] = [];

    const endDate = timeRange.endDate ? new Date(timeRange.endDate) : new Date();
    const startDate = timeRange.startDate
      ? new Date(timeRange.startDate)
      : new Date(endDate.getTime() - ((timeRange.days ?? 30) * 24 * 60 * 60 * 1000));
    const windowDays = timeRange.days
      ?? Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1);

    const STUDY_METHOD_LABEL: Record<string, string> = {
      spacedRepetition: 'Memorización espaciada',
      simulatedTest: 'Pruebas simuladas',
      pomodoro: 'Pomodoro',
    };
    const LEARNING_METHOD_LABEL: Record<string, string> = {
      activeRecall: 'Repaso Activo',
      cornell: 'Cornell',
      visualCard: 'Visual',
    };

    // ── Insight 1: best method (real exam grades) ─────────
    // Re-use the exam-correlation endpoint; emit the top combo if any has
    // ≥3 samples (matching the chart's display threshold).
    const examCorr = await this.getExamCorrelation(userId, timeRange);
    const significant = examCorr.filter((c) => c.sampleSize >= 3);
    if (significant.length > 0) {
      const best = significant.sort((a, b) => b.avgExamScore - a.avgExamScore)[0];
      out.push({
        key: 'best_method',
        rq: 'RQ2',
        headline: `Tu mejor combinación fue ${STUDY_METHOD_LABEL[best.studyMethod] ?? best.studyMethod} con ${LEARNING_METHOD_LABEL[best.learningMethod] ?? best.learningMethod}`,
        detail: `Promedio de ${best.avgExamScore}% en ${best.sampleSize} ${best.sampleSize === 1 ? 'examen' : 'exámenes'} de los últimos ${windowDays} días.`,
        supportingChart: 'exam-correlation',
        confidence: best.sampleSize >= 10 ? 'high' : 'medium',
        computation:
          'Promedio de notas reales (%) por cada combinación (método de estudio × tipo de carta) usada en los 30 días previos a cada examen. Solo se consideran combinaciones con al menos 3 exámenes.',
      });
    }

    // ── Insight 2: retention quality ──────────────────────
    const reviews = await this.prisma.cardReview.findMany({
      where: {
        userId,
        reviewedAt: { gte: startDate, lte: endDate },
      },
      select: { evaluation: true },
    });
    if (reviews.length >= 5) {
      const good = reviews.filter(
        (r) => r.evaluation === 'bien' || r.evaluation === 'facil',
      ).length;
      const pct = Math.round((good / reviews.length) * 100);
      let detail: string;
      if (pct >= 70)
        detail = `Recordaste bien o fácil ${good} de ${reviews.length} cartas. Tu retención es sólida.`;
      else if (pct >= 50)
        detail = `Recordaste bien o fácil ${good} de ${reviews.length} cartas. Repasa más seguido las que marcas como difíciles.`;
      else
        detail = `Solo ${good} de ${reviews.length} cartas fueron bien/fácil. Conviene espaciar más tus repasos para consolidar lo difícil.`;
      out.push({
        key: 'retention_quality',
        rq: 'general',
        headline: `${pct}% de tus repasos fueron "Bien" o "Fácil"`,
        detail,
        supportingChart: 'spaced-repetition',
        confidence: reviews.length >= 30 ? 'high' : reviews.length >= 10 ? 'medium' : 'low',
        computation: `Porcentaje de evaluaciones marcadas como "Bien" o "Fácil" sobre el total (${reviews.length}) en los últimos ${windowDays} días.`,
      });
    }

    // ── Insight 3: adherence (active days) ────────────────
    if (windowDays >= 7) {
      // Activity-calendar endpoint is year-bucketed; pull a focused query for
      // just this window so the calc matches the user's selected range.
      const sessions = await this.prisma.studySession.findMany({
        where: {
          userId,
          startTime: { gte: startDate, lte: endDate },
          endTime: { not: null },
        },
        select: { startTime: true },
      });
      const dayKeys = new Set(
        sessions.map((s) => s.startTime.toISOString().slice(0, 10)),
      );
      const activeDays = dayKeys.size;
      const pct = Math.round((activeDays / windowDays) * 100);
      let detail: string;
      if (pct >= 60)
        detail =
          'Tu consistencia es alta; el efecto del aprendizaje espaciado se acumula con el tiempo.';
      else if (pct >= 30)
        detail =
          'Estudiar algunos días seguidos podría acelerar tu progreso. Pequeñas sesiones diarias suelen rendir más que las esporádicas.';
      else
        detail =
          'La frecuencia importa más que la duración. Intenta una sesión breve la mayoría de los días.';
      out.push({
        key: 'adherence',
        rq: 'RQ5',
        headline: `Estudiaste ${activeDays} de los últimos ${windowDays} días`,
        detail,
        supportingChart: 'activity',
        confidence: 'high',
        computation:
          'Número de días en el rango seleccionado con al menos una sesión de estudio finalizada.',
      });
    }

    // ── Insight 4: most-used study method (by time) ───────
    const sessionsForMethod = await this.prisma.studySession.findMany({
      where: {
        userId,
        startTime: { gte: startDate, lte: endDate },
        endTime: { not: null },
      },
      include: { pomodoro: true },
    });
    if (sessionsForMethod.length >= 3) {
      const byMethod = new Map<string, { count: number; minutes: number }>();
      for (const s of sessionsForMethod) {
        const mins =
          s.studyMethod === 'pomodoro' && s.pomodoro
            ? s.pomodoro.totalStudyTimeMin
            : s.minDuration ?? 0;
        const cur = byMethod.get(s.studyMethod) ?? { count: 0, minutes: 0 };
        cur.count += 1;
        cur.minutes += mins;
        byMethod.set(s.studyMethod, cur);
      }
      const totalMin = Array.from(byMethod.values()).reduce(
        (a, m) => a + m.minutes,
        0,
      );
      if (totalMin > 0) {
        const [topMethod, topStats] = Array.from(byMethod.entries()).sort(
          ([, a], [, b]) => b.minutes - a.minutes,
        )[0];
        const share = Math.round((topStats.minutes / totalMin) * 100);
        out.push({
          key: 'most_used_method',
          rq: 'RQ1',
          headline: `${STUDY_METHOD_LABEL[topMethod] ?? topMethod} concentró el ${share}% de tu tiempo`,
          detail: `${topStats.count} ${topStats.count === 1 ? 'sesión' : 'sesiones'} · ${topStats.minutes} minutos en los últimos ${windowDays} días.`,
          supportingChart: 'methods',
          confidence: sessionsForMethod.length >= 10 ? 'high' : 'medium',
          computation:
            'Tiempo total de estudio agregado por método dentro de la ventana seleccionada. El porcentaje se calcula sobre el tiempo total registrado en ese rango.',
        });
      }
    }

    return out;
  }
}