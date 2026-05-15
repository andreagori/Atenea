import { Injectable, ConflictException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { LearningMethod } from './dto/create-card.dto';
import { BulkCardRow, BulkCreateCardDto } from './dto/bulk-create-card.dto';

@Injectable()
export class CardService {
  // Logger for the DeckService class, which is used to log messages and errors.
  private readonly logger = new Logger(CardService.name);
  // PrismaService instance for database operations.
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Crea una carta y valida que el nombre no se repita
   * @param createCardDto
   * @returns Carta creada o mensaje de error
   */
  async create(createCardDto: CreateCardDto, deckId: number, userId: number) {
    const { title, learningMethod } = createCardDto;

    // 1. Verifica que el deck pertenezca al usuario
    const deck = await this.prisma.deck.findFirst({
      where: {
        deckId,
        userId,
      },
    });

    if (!deck) {
      throw new NotFoundException(`El mazo con ID ${deckId} no pertenece al usuario`);
    }

    // 2. Crea la carta base
    const card = await this.prisma.card.create({
      data: {
        title,
        deckId,
        learningMethod,
      },
    });

    // 3. Crea contenido específico según el método
    switch (learningMethod) {
      case LearningMethod.ACTIVE_RECALL:
        if (!createCardDto.questionTitle || !createCardDto.answer) {
          throw new BadRequestException('Faltan campos para Active Recall');
        }

        await this.prisma.cardsActiveRecall.create({
          data: {
            cardId: card.cardId,
            questionTitle: createCardDto.questionTitle,
            answer: createCardDto.answer,
          },
        });
        break;

      case LearningMethod.CORNELL:
        if (
          !createCardDto.principalNote ||
          !createCardDto.noteQuestions ||
          !createCardDto.shortNote
        ) {
          throw new BadRequestException('Faltan campos para el método Cornell');
        }

        await this.prisma.cardsCornell.create({
          data: {
            cardId: card.cardId,
            principalNote: createCardDto.principalNote,
            noteQuestions: createCardDto.noteQuestions,
            shortNote: createCardDto.shortNote,
          },
        });
        break;

      case LearningMethod.VISUAL_CARD:
        if (!createCardDto.urlImage) {
          throw new BadRequestException('Falta la imagen para Visual Card');
        }

        await this.prisma.visualCard.create({
          data: {
            cardId: card.cardId,
            urlImage: createCardDto.urlImage,
          },
        });
        break;

      default:
        throw new BadRequestException('Método de aprendizaje no válido');
    }

    return {
      message: 'Carta creada con éxito',
      card,
    };
  }

  // Normaliza y valida una fila; devuelve el error en español o null si es válida.
  private validateRow(row: BulkCardRow): { method: LearningMethod; title: string; error: string | null } {
    const title = (row.title ?? '').trim();
    const method = ((row.learningMethod ?? 'activeRecall').toString().trim() ||
      'activeRecall') as LearningMethod;

    if (title.length < 3 || title.length > 100) {
      return { method, title, error: 'El título debe tener entre 3 y 100 caracteres' };
    }
    if (method === LearningMethod.VISUAL_CARD) {
      return { method, title, error: 'Las cartas visuales no se pueden crear por carga masiva' };
    }
    if (method !== LearningMethod.ACTIVE_RECALL && method !== LearningMethod.CORNELL) {
      return { method, title, error: `Método no válido: "${method}"` };
    }
    if (method === LearningMethod.ACTIVE_RECALL) {
      if (!(row.questionTitle ?? '').trim() || !(row.answer ?? '').trim()) {
        return { method, title, error: 'Faltan Pregunta o Respuesta' };
      }
    }
    if (method === LearningMethod.CORNELL) {
      if (
        !(row.principalNote ?? '').trim() ||
        !(row.noteQuestions ?? '').trim() ||
        !(row.shortNote ?? '').trim()
      ) {
        return { method, title, error: 'Faltan Nota principal, Preguntas guía o Resumen' };
      }
    }
    return { method, title, error: null };
  }

  /**
   * Crea cartas en lote. Una fila inválida no aborta el resto.
   * @returns Resumen { created, skipped, total, errors }
   */
  async createBulk(dto: BulkCreateCardDto, deckId: number, userId: number) {
    const deck = await this.prisma.deck.findFirst({ where: { deckId, userId } });
    if (!deck) {
      throw new NotFoundException(`El mazo con ID ${deckId} no pertenece al usuario`);
    }

    const errors: { row: number; title: string; message: string }[] = [];
    let created = 0;

    for (let i = 0; i < dto.cards.length; i++) {
      const row = dto.cards[i];
      const { method, title, error } = this.validateRow(row);

      if (error) {
        errors.push({ row: i + 1, title, message: error });
        continue;
      }

      try {
        await this.prisma.$transaction(async (tx) => {
          const card = await tx.card.create({
            data: { title, deckId, learningMethod: method },
          });

          if (method === LearningMethod.ACTIVE_RECALL) {
            await tx.cardsActiveRecall.create({
              data: {
                cardId: card.cardId,
                questionTitle: (row.questionTitle ?? '').trim(),
                answer: (row.answer ?? '').trim(),
              },
            });
          } else {
            await tx.cardsCornell.create({
              data: {
                cardId: card.cardId,
                principalNote: (row.principalNote ?? '').trim(),
                noteQuestions: (row.noteQuestions ?? '').trim(),
                shortNote: (row.shortNote ?? '').trim(),
              },
            });
          }
        });
        created++;
      } catch (e) {
        this.logger.error(`Error creando carta en fila ${i + 1}`, e as Error);
        errors.push({ row: i + 1, title, message: 'Error al guardar la carta' });
      }
    }

    return {
      message: `${created} carta(s) creada(s), ${errors.length} omitida(s)`,
      created,
      skipped: errors.length,
      total: dto.cards.length,
      errors,
    };
  }

  /**
   * Busca todas las cartas de un mazo
   * @param deckId
   * @param id
   * @returns Cartas encontradas o mensaje de error
   */
  async findAll(deckId: number, userId: number): Promise<Card[]> {
    // Verificar ownership del mazo
    const deck = await this.prisma.deck.findFirst({
      where: {
        deckId,
        userId,
      },
    });

    if (!deck) {
      throw new NotFoundException('El mazo no pertenece al usuario');
    }

    return this.prisma.card.findMany({
      where: {
        deckId,
      },
      include: {
        activeRecall: true,
        cornell: true,
        visualCard: true,
      },
    });
  }

  /**
   * Busca una carta por su ID
   * @param id ID de la carta a buscar
   * @param deckId ID del mazo al que pertenece la carta
   * @param userId ID del usuario propietario de la carta
   * @returns Carta encontrada o mensaje de error
   */
  async findOne(id: number, deckId: number, userId: number): Promise<Card> {
    const deck = await this.prisma.deck.findFirst({
      where: { deckId, userId },
    });

    if (!deck) {
      throw new NotFoundException('El mazo no pertenece al usuario');
    }

    const card = await this.prisma.card.findFirst({
      where: {
        cardId: id,
        deckId,
      },
      include: {
        activeRecall: true,
        cornell: true,
        visualCard: true,
      },
    });

    if (!card) {
      throw new NotFoundException(`Carta con ID ${id} no encontrada`);
    }

    return card;
  }

  async update(id: number, deckId: number, userId: number, updateCardDto: UpdateCardDto): Promise<Card> {
    // 1. Verificar que el deck pertenezca al usuario
    const deck = await this.prisma.deck.findFirst({
      where: { deckId, userId },
    });

    if (!deck) {
      throw new NotFoundException('El mazo no pertenece al usuario');
    }

    // 2. Verificar que la carta exista
    const existingCard = await this.prisma.card.findFirst({
      where: { cardId: id, deckId },
      include: {
        activeRecall: true,
        cornell: true,
        visualCard: true,
      },
    });

    if (!existingCard) {
      throw new NotFoundException(`Carta con ID ${id} no encontrada`);
    }

    // 3. Actualizar la carta base (solo el título)
    const updatedCard = await this.prisma.$transaction(async (prisma) => {
      const card = await prisma.card.update({
        where: { cardId: id },
        data: {
          title: updateCardDto.title,
          // Ya no actualizamos learningMethod
        },
      });

      // 4. Actualizar el contenido específico según el método existente
      switch (existingCard.learningMethod) {
        case LearningMethod.ACTIVE_RECALL:
          if (existingCard.activeRecall && updateCardDto.questionTitle && updateCardDto.answer) {
            await prisma.cardsActiveRecall.update({
              where: { cardId: id },
              data: {
                questionTitle: updateCardDto.questionTitle,
                answer: updateCardDto.answer,
              },
            });
          }
          break;

        case LearningMethod.CORNELL:
          if (existingCard.cornell &&
            updateCardDto.principalNote &&
            updateCardDto.noteQuestions &&
            updateCardDto.shortNote) {
            await prisma.cardsCornell.update({
              where: { cardId: id },
              data: {
                principalNote: updateCardDto.principalNote,
                noteQuestions: updateCardDto.noteQuestions,
                shortNote: updateCardDto.shortNote,
              },
            });
          }
          break;

        case LearningMethod.VISUAL_CARD:
          if (existingCard.visualCard) {
            await prisma.visualCard.update({
              where: { cardId: id },
              data: {
                urlImage: updateCardDto.urlImage || existingCard.visualCard.urlImage,
              },
            });
          }
          break;
      }

      return prisma.card.findFirst({
        where: { cardId: id },
        include: {
          activeRecall: true,
          cornell: true,
          visualCard: true,
        },
      });
    });

    if (!updatedCard) {
      throw new NotFoundException(`Error actualizando la carta con ID ${id}`);
    }

    return updatedCard;
  }

  /**
   * Elimina una carta por su ID
   * @param id ID de la carta a eliminar
   * @param deckId ID del mazo al que pertenece la carta
   * @param userId ID del usuario propietario de la carta ??
   * @returns Mensaje de éxito o error
   */
  async remove(id: number, deckId: number, userId: number): Promise<string> {
    const deck = await this.prisma.deck.findFirst({
      where: { deckId, userId },
    });

    if (!deck) {
      throw new NotFoundException('El mazo no pertenece al usuario');
    }

    const card = await this.prisma.card.findFirst({
      where: { cardId: id, deckId },
    });

    if (!card) {
      throw new NotFoundException(`Carta con ID ${id} no encontrada`);
    }

    await this.prisma.card.delete({
      where: { cardId: id },
    });
    return `Carta con ID ${id} eliminada con éxito`;
  }
}
