import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { StudySession } from './entities/study-session.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/JwtAuthGuard';

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

  @Post(':sessionId/finish')
  @ApiResponse({ status: 200, description: 'Sesión de estudio finalizada', type: StudySession })
  finishSession(@Param('sessionId') sessionId: string, @Request() req) {
    return this.studySessionsService.finishSession(+sessionId, req.user.userId);
  }

}
