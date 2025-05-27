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
}