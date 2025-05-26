import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LearningMethod, StudyMethod } from '@prisma/client';

@Injectable()
export class UserStatsService {
  private readonly logger = new Logger(UserStatsService.name);
  constructor(private readonly prisma: PrismaService) { }

  /*
  * Calculate and update user statistics based on their learning and study methods.
  */
  async calculateAndUpdateUserStats(userId: number) {
    try {
      this.logger.debug(`Calculando estadísticas para usuario ${userId}`);

      // 1. Grab user's study sessions
      const sessions = await this.prisma.studySession.findMany({
        where: { userId },
        include: {
          pomodoro: true,
          activeRecall: true,
          simulatedTest: true
        }
      });

      // 2. calculate total number of sessions
      const totalSessions = sessions.length;

      // 3. calculate total study time in minutes
      let totalStudyMin = 0;

      for (const session of sessions) {
        if (session.studyMethod === 'pomodoro' && session.pomodoro) {
          totalStudyMin += session.pomodoro.totalStudyTimeMin;
        } else if (session.endTime && session.startTime) {
          const durationMs = session.endTime.getTime() - session.startTime.getTime();
          const durationMin = Math.floor(durationMs / 60000);
          totalStudyMin += durationMin;
        }
      }

      // 4. Find the most used study method
      const studyMethodCounts = sessions.reduce((acc, session) => {
        acc[session.studyMethod] = (acc[session.studyMethod] || 0) + 1;
        return acc;
      }, {} as Record<StudyMethod, number>);

      const mostUsedStudyM = Object.entries(studyMethodCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] as StudyMethod || null;

      // 5. Find the most used learning method
      const learningMethodCounts: Record<string, number> = {};

      sessions.forEach(session => {
        session.learningMethod.forEach(method => {
          learningMethodCounts[method] = (learningMethodCounts[method] || 0) + 1;
        });
      });

      const mostUsedLearningM = Object.entries(learningMethodCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] as LearningMethod || null;

      // 6. Update or create user statistics in the database
      const userStats = await this.prisma.userStats.upsert({
        where: { userId },
        update: {
          totalSessions,
          totalStudyMin,
          mostUsedLearningM,
          mostUsedStudyM
        },
        create: {
          userId,
          totalSessions,
          totalStudyMin,
          mostUsedLearningM,
          mostUsedStudyM
        }
      });

      this.logger.debug(`Estadísticas actualizadas para usuario ${userId}:`, {
        totalSessions,
        totalStudyMin,
        mostUsedLearningM,
        mostUsedStudyM
      });

      return userStats;
    } catch (error) {
      this.logger.error(`Error calculando estadísticas para usuario ${userId}:`, error);
      throw error;
    }
  }

  async updateStatsOnSessionComplete(sessionId: number) {
    try {
      const session = await this.prisma.studySession.findUnique({
        where: { sessionId },
        include: {
          pomodoro: true,
          activeRecall: true,
          simulatedTest: true
        }
      });

      if (!session || !session.endTime) {
        this.logger.warn(`Sesión ${sessionId} no encontrada o no finalizada`);
        return;
      }

      await this.calculateAndUpdateUserStats(session.userId);
    } catch (error) {
      this.logger.error(`Error actualizando estadísticas para sesión ${sessionId}:`, error);
      throw error;
    }
  }

  async getUserStats(userId: number) {
    const stats = await this.prisma.userStats.findUnique({
      where: { userId }
    });

    // Si no existen estadísticas, calcularlas
    if (!stats) {
      return await this.calculateAndUpdateUserStats(userId);
    }

    return stats;
  }

  /**
   * Obtiene estadísticas detalladas adicionales
   */
  async getDetailedUserStats(userId: number) {
    const basicStats = await this.getUserStats(userId);

    // Estadísticas adicionales calculadas en tiempo real
    const [
      sessionsByMethod,
      sessionsByLearningMethod,
      totalCards,
      averageSessionDuration,
      recentSessions
    ] = await Promise.all([
      // Sesiones por método de estudio
      this.prisma.studySession.groupBy({
        by: ['studyMethod'],
        where: { userId },
        _count: { studyMethod: true }
      }),

      // Sesiones por método de aprendizaje (más complejo)
      this.getSessionsByLearningMethod(userId),

      // Total de cartas revisadas
      this.prisma.cardReview.count({
        where: { userId }
      }),

      // Duración promedio de sesiones
      this.getAverageSessionDuration(userId),

      // Últimas 5 sesiones
      this.prisma.studySession.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        take: 5,
        include: {
          deck: { select: { title: true } }
        }
      })
    ]);

    return {
      ...basicStats,
      sessionsByMethod,
      sessionsByLearningMethod,
      totalCards,
      averageSessionDuration,
      recentSessions
    };
  }

  private async getSessionsByLearningMethod(userId: number) {
    const sessions = await this.prisma.studySession.findMany({
      where: { userId },
      select: { learningMethod: true }
    });

    const methodCounts: Record<string, number> = {};
    sessions.forEach(session => {
      session.learningMethod.forEach(method => {
        methodCounts[method] = (methodCounts[method] || 0) + 1;
      });
    });

    return Object.entries(methodCounts).map(([method, count]) => ({
      learningMethod: method,
      _count: { learningMethod: count }
    }));
  }

  private async getAverageSessionDuration(userId: number) {
    const completedSessions = await this.prisma.studySession.findMany({
      where: {
        userId,
        endTime: { not: null }
      },
      select: {
        startTime: true,
        endTime: true,
        studyMethod: true,
        pomodoro: {
          select: { totalStudyTimeMin: true }
        }
      }
    });

    if (completedSessions.length === 0) return 0;

    let totalMinutes = 0;

    completedSessions.forEach(session => {
      if (session.studyMethod === 'pomodoro' && session.pomodoro) {
        totalMinutes += session.pomodoro.totalStudyTimeMin;
      } else if (session.endTime) {
        const durationMs = session.endTime.getTime() - session.startTime.getTime();
        totalMinutes += Math.floor(durationMs / 60000);
      }
    });

    return Math.round(totalMinutes / completedSessions.length);
  }

  /**
   * Recalcula todas las estadísticas de todos los usuarios (útil para migración)
   */
  async recalculateAllUserStats() {
    const users = await this.prisma.user.findMany({
      select: { userId: true }
    });

    this.logger.log(`Recalculando estadísticas para ${users.length} usuarios`);

    for (const user of users) {
      try {
        await this.calculateAndUpdateUserStats(user.userId);
      } catch (error) {
        this.logger.error(`Error recalculando estadísticas para usuario ${user.userId}:`, error);
      }
    }

    this.logger.log('Recálculo de estadísticas completado');
  }

}
