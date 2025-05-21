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
  findAll() {
    return this.studySessionsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Sesión de estudio encontrada', type: StudySession })
  findOne(@Param('id') id: string, @Request() req) {
    return this.studySessionsService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudySessionDto: UpdateStudySessionDto) {
    return this.studySessionsService.update(+id, updateStudySessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studySessionsService.remove(+id);
  }
}
