import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/JwtAuthGuard';
import { AnalyticsService } from './analytics.service';
import { TimeRangeDto, DeckAnalyticsDto } from './dto/create-analytics.dto';

@ApiTags('analytics')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('daily-study-time')
  @ApiResponse({ status: 200, description: 'Tiempo de estudio diario' })
  async getDailyStudyTime(
    @Query() timeRange: TimeRangeDto,
    @Request() req
  ) {
    return this.analyticsService.getDailyStudyTime(req.user.userId, timeRange);
  }

  @Get('test-scores')
  @ApiResponse({ status: 200, description: 'Puntuaciones en tests' })
  async getTestScores(
    @Query() timeRange: TimeRangeDto,
    @Request() req
  ) {
    return this.analyticsService.getTestScores(req.user.userId, timeRange);
  }

  @Get('methods-distribution')
  @ApiResponse({ status: 200, description: 'Distribución de métodos' })
  async getMethodsDistribution(
    @Query() timeRange: TimeRangeDto,
    @Request() req
  ) {
    return this.analyticsService.getMethodsDistribution(req.user.userId, timeRange);
  }

  @Get('activity-calendar')
  @ApiResponse({ status: 200, description: 'Calendario de actividad' })
  async getActivityCalendar(
    @Query('year') year: number = new Date().getFullYear(),
    @Request() req
  ) {
    return this.analyticsService.getActivityCalendar(req.user.userId, year);
  }

  @Get('method-efficiency')
  @ApiResponse({ status: 200, description: 'Eficiencia por método' })
  async getMethodEfficiency(
    @Query() timeRange: TimeRangeDto,
    @Request() req
  ) {
    return this.analyticsService.getMethodEfficiency(req.user.userId, timeRange);
  }

  @Get('deck-progress')
  @ApiResponse({ status: 200, description: 'Progreso por deck' })
  async getDeckProgress(
    @Query() timeRange: TimeRangeDto,
    @Request() req
  ) {
    return this.analyticsService.getDeckProgress(req.user.userId, timeRange);
  }

  @Get('card-retention')
  @ApiResponse({ status: 200, description: 'Retención de cartas' })
  async getCardRetention(
    @Query() deckAnalytics: DeckAnalyticsDto,
    @Request() req
  ) {
    return this.analyticsService.getCardRetention(req.user.userId, deckAnalytics.deckId);
  }

  @Get('productive-hours')
  @ApiResponse({ status: 200, description: 'Horas productivas' })
  async getProductiveHours(
    @Query() timeRange: TimeRangeDto,
    @Request() req
  ) {
    return this.analyticsService.getProductiveHours(req.user.userId, timeRange);
  }

  @Get('sessions-performance')
  @ApiResponse({ status: 200, description: 'Rendimiento por sesión' })
  async getSessionsPerformance(
    @Query() timeRange: TimeRangeDto,
    @Request() req
  ) {
    return this.analyticsService.getSessionsPerformance(req.user.userId, timeRange);
  }

  @Get('spaced-repetition-stats')
  @ApiResponse({ status: 200, description: 'Estadísticas de memorización espaciada' })
  async getSpacedRepetitionStats(
    @Query() timeRange: TimeRangeDto,
    @Request() req
  ) {
    return this.analyticsService.getSpacedRepetitionStats(req.user.userId, timeRange);
  }
}