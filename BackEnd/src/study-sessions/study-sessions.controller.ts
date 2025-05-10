import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';

@Controller('study-sessions')
export class StudySessionsController {
  constructor(private readonly studySessionsService: StudySessionsService) {}

  @Post()
  create(@Body() createStudySessionDto: CreateStudySessionDto) {
    return this.studySessionsService.create(createStudySessionDto);
  }

  @Get()
  findAll() {
    return this.studySessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studySessionsService.findOne(+id);
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
