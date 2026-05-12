import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/JwtAuthGuard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@ApiTags('exam')
@UseGuards(JwtAuthGuard)
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @ApiResponse({ status: 201, description: 'Examen registrado' })
  @Post()
  create(@GetUser() user: any, @Body() dto: CreateExamDto) {
    return this.examService.create(user.userId, dto);
  }

  @ApiResponse({ status: 200, description: 'Lista de exámenes del usuario' })
  @Get()
  findAll(
    @GetUser() user: any,
    @Query('deckId') deckId?: string,
  ) {
    const parsedDeckId = deckId ? parseInt(deckId, 10) : undefined;
    return this.examService.findAll(user.userId, parsedDeckId);
  }

  @ApiResponse({ status: 200, description: 'Examen encontrado' })
  @Get(':examId')
  findOne(
    @GetUser() user: any,
    @Param('examId', ParseIntPipe) examId: number,
  ) {
    return this.examService.findOne(user.userId, examId);
  }

  @ApiResponse({ status: 200, description: 'Examen actualizado' })
  @Patch(':examId')
  update(
    @GetUser() user: any,
    @Param('examId', ParseIntPipe) examId: number,
    @Body() dto: UpdateExamDto,
  ) {
    return this.examService.update(user.userId, examId, dto);
  }

  @ApiResponse({ status: 200, description: 'Examen eliminado' })
  @Delete(':examId')
  remove(
    @GetUser() user: any,
    @Param('examId', ParseIntPipe) examId: number,
  ) {
    return this.examService.remove(user.userId, examId);
  }
}
