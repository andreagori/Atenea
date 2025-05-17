import { Injectable, ConflictException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { LearningMethod } from './dto/create-card.dto';

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

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
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
