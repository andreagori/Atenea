import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
  private readonly logger = new Logger(ExamService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verify the deck (if provided) belongs to this user. Throws otherwise.
   * Done with one query both on create and update.
   */
  private async assertDeckOwnership(userId: number, deckId: number) {
    const deck = await this.prisma.deck.findFirst({
      where: { deckId, userId },
      select: { deckId: true },
    });
    if (!deck) {
      throw new NotFoundException('Mazo no encontrado o no autorizado');
    }
  }

  /**
   * An exam must be identified somehow — either by a deck or a free-text
   * subject. Without either, correlation analytics have nothing to anchor on.
   */
  private assertHasAnchor(dto: { deckId?: number; subject?: string }) {
    if (!dto.deckId && !dto.subject?.trim()) {
      throw new BadRequestException(
        'Especifica un mazo o el nombre de la materia.',
      );
    }
  }

  async create(userId: number, dto: CreateExamDto) {
    this.assertHasAnchor(dto);
    if (dto.deckId) {
      await this.assertDeckOwnership(userId, dto.deckId);
    }

    return this.prisma.exam.create({
      data: {
        userId,
        deckId: dto.deckId ?? null,
        subject: dto.subject ?? null,
        examDate: new Date(dto.examDate),
        examScore: dto.examScore,
        maxScore: dto.maxScore ?? 100,
        note: dto.note ?? null,
      },
    });
  }

  async findAll(userId: number, deckId?: number) {
    return this.prisma.exam.findMany({
      where: { userId, ...(deckId ? { deckId } : {}) },
      orderBy: { examDate: 'desc' },
    });
  }

  async findOne(userId: number, examId: number) {
    const exam = await this.prisma.exam.findFirst({
      where: { examId, userId },
    });
    if (!exam) {
      throw new NotFoundException('Examen no encontrado');
    }
    return exam;
  }

  async update(userId: number, examId: number, dto: UpdateExamDto) {
    // Verify ownership first.
    await this.findOne(userId, examId);

    if (dto.deckId !== undefined && dto.deckId !== null) {
      await this.assertDeckOwnership(userId, dto.deckId);
    }

    return this.prisma.exam.update({
      where: { examId },
      data: {
        ...(dto.deckId !== undefined ? { deckId: dto.deckId } : {}),
        ...(dto.subject !== undefined ? { subject: dto.subject } : {}),
        ...(dto.examDate !== undefined
          ? { examDate: new Date(dto.examDate) }
          : {}),
        ...(dto.examScore !== undefined ? { examScore: dto.examScore } : {}),
        ...(dto.maxScore !== undefined ? { maxScore: dto.maxScore } : {}),
        ...(dto.note !== undefined ? { note: dto.note } : {}),
      },
    });
  }

  async remove(userId: number, examId: number) {
    await this.findOne(userId, examId);
    await this.prisma.exam.delete({ where: { examId } });
    return { message: 'Examen eliminado correctamente' };
  }
}
