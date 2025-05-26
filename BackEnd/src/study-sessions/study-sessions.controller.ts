import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { StudySession } from './entities/study-session.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/JwtAuthGuard';
import { TestQuestionDto, TestAnswerDto } from '../test-question/dto/test-question.dto';
import { TestResultDto } from './dto/test-result.dto';

@ApiTags('study-sessions')
@UseGuards(JwtAuthGuard)
@Controller('study-sessions')
export class StudySessionsController {
  constructor(private readonly studySessionsService: StudySessionsService) { }

  @Post('deck/:deckId')
  @ApiResponse({ status: 201, description: 'Sesión de estudio creada', type: StudySession })
  create(
    @Param('deckId') deckId: string,
    @Body() createStudySessionDto: CreateStudySessionDto,
    @Request() req: any
  ) {
    return this.studySessionsService.create(
      createStudySessionDto,
      req.user.userId,
      +deckId
    );
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de sesiones de estudio', type: StudySession, isArray: true })
  findAll(@Request() req) {
    return this.studySessionsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Sesión de estudio encontrada', type: StudySession })
  findOne(@Param('id') id: string, @Request() req) {
    return this.studySessionsService.findOne(+id, req.user.userId);
  }

  // STUDY METHODS: SPACED_REPETITION

  @Get(':sessionId/next-card')
  @ApiResponse({ status: 200, description: 'Siguiente carta encontrada', type: StudySession })
  getNextCard(@Param('sessionId') sessionId: string, @Request() req) {
    return this.studySessionsService.getNextCard(+sessionId, req.user.userId);
  }

  @Get(':sessionId/progress')
  @ApiResponse({ status: 200, description: 'Progreso de la sesión de estudio en memorización espaciada', type: StudySession })
  getSpacedRepetitionProgress(
    @Param('sessionId') sessionId: string,
    @Request() req
  ) {
    return this.studySessionsService.getSpacedRepetitionProgress(
      +sessionId,
      req.user.userId
    );
  }

  @Get(':sessionId/to-review')
  @ApiResponse({ status: 200, description: 'Cartas a revisar en la sesión de estudio', type: StudySession })
  getCardsToReview(
    @Param('sessionId') sessionId: string,
    @Request() req
  ) {
    return this.studySessionsService.getCardsToReview(
      +sessionId,
      req.user.userId
    );
  }

  // STUDY METHODS: POMODORO
  @Get(':sessionId/pomodoro/next-card')
  @ApiResponse({ status: 200, description: 'Siguiente carta para estudiar en Pomodoro' })
  getPomodoroNextCard(@Param('sessionId') sessionId: string, @Request() req) {
    return this.studySessionsService.getPomodoroNextCard(+sessionId, req.user.userId);
  }

  @Get(':sessionId/pomodoro/progress')
  @ApiResponse({ status: 200, description: 'Progreso de la sesión Pomodoro' })
  getPomodoroProgress(@Param('sessionId') sessionId: string, @Request() req) {
    return this.studySessionsService.getPomodoroProgress(+sessionId, req.user.userId);
  }

  @Post(':sessionId/pomodoro/evaluate')
  @ApiResponse({ status: 200, description: 'Evalúa una carta en sesión Pomodoro' })
  evaluatePomodoroCard(
    @Param('sessionId') sessionId: string,
    @Body() evaluationDto: { cardId: number; evaluation: string },
    @Request() req
  ) {
    return this.studySessionsService.evaluateCard(+sessionId, evaluationDto.cardId, evaluationDto.evaluation, req.user.userId);
  }

  @Post(':sessionId/pomodoro/start-break')
  @ApiResponse({ status: 200, description: 'Iniciar descanso en sesión Pomodoro' })
  startPomodoroBreak(@Param('sessionId') sessionId: string, @Request() req) {
    return this.studySessionsService.startPomodoroBreak(+sessionId, req.user.userId);
  }

  @Post(':sessionId/pomodoro/end-break')
  @ApiResponse({ status: 200, description: 'Finalizar descanso en sesión Pomodoro' })
  endPomodoroBreak(@Param('sessionId') sessionId: string, @Request() req) {
    return this.studySessionsService.endPomodoroBreak(+sessionId, req.user.userId);
  }

  @Get(':sessionId/pomodoro/status')
  @ApiResponse({ status: 200, description: 'Estado actual de la sesión Pomodoro' })
  getPomodoroStatus(@Param('sessionId') sessionId: string, @Request() req) {
    return this.studySessionsService.getPomodoroStatus(+sessionId, req.user.userId);
  }


  // STUDY METHODS: SIMULATED_TEST
  @Get(':sessionId/test-question')
  @ApiResponse({ status: 200, description: 'Obtiene la siguiente pregunta del test', type: TestQuestionDto })
  getTestQuestion(@Param('sessionId') sessionId: string, @Request() req) {
    return this.studySessionsService.getTestQuestion(+sessionId, req.user.userId);
  }

  @Get(':sessionId/test-progress')
  @ApiResponse({ status: 200, description: 'Obtiene el progreso actual del test' })
  getTestProgress(
    @Param('sessionId') sessionId: string,
    @Request() req
  ) {
    return this.studySessionsService.getTestProgress(+sessionId, req.user.userId);
  }

  @Post(':sessionId/test-answer')
  async submitTestAnswer(
    @Param('sessionId') sessionId: string,
    @Body() answerDto: TestAnswerDto,
    @Request() req
  ) {
    return this.studySessionsService.evaluateTestAnswer(
      parseInt(sessionId),
      req.user.userId, // Usar userId en lugar de id
      answerDto
    );
  }

  @Get(':sessionId/test-result')
  @ApiResponse({ status: 200, description: 'Obtiene el resultado final del test', type: TestResultDto })
  getTestResult(
    @Param('sessionId') sessionId: string,
    @Request() req
  ) {
    return this.studySessionsService.getTestResult(+sessionId, req.user.userId);
  }

  @Post(':sessionId/finish')
  @ApiResponse({ status: 200, description: 'Sesión de estudio finalizada', type: StudySession })
  finishSession(
    @Param('sessionId') sessionId: string,
    @Request() req
  ) {
    return this.studySessionsService.finishSession(+sessionId, req.user.userId);
  }

}
