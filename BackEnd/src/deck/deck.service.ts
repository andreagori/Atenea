import { Injectable, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Deck } from './entities/deck.entity';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Injectable()
export class DeckService {
  // Logger for the DeckService class, which is used to log messages and errors.
  private readonly logger = new Logger(DeckService.name);
  // PrismaService instance for database operations.
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Crea un mazo y valida que el nombre no se repita
   * @param createDeckDto
   * @returns Mazo creado o mensaje de error
   *  
   * */
  async create(createDeckDto: CreateDeckDto, userId: number) {
    const deckNameExists = await this.prisma.deck.findFirst({
      where: {
        title: createDeckDto.title,
        userId,
      },
    });

    if (deckNameExists) {
      this.logger.error(`Deck name ${createDeckDto.title} already exists`);
      throw new ConflictException('Deck name already exists');
    }

    return await this.prisma.deck.create({
      data: {
        title: createDeckDto.title,
        body: createDeckDto.body,
        user: {
          connect: {
            userId
          }
        }
      },
    });
  }

  /**
   * Busca todos los mazos
   * @returns Lista de mazos
   */
async findAll(userId: number): Promise<Deck[]> {
  return this.prisma.deck.findMany({
    where: { userId },
  });
}

  /**
   * Busca un mazo por su ID
   * @param userId ID del usuario propietario del mazo
   * @param deckId ID del mazo a buscar
   * @returns Mazo encontrado o mensaje de error
   */
  async findOne(@GetUser() user: any, deckId: number): Promise<Deck> {
    const deck = await this.prisma.deck.findFirst({
      where: {
        deckId: deckId,
        user
      },
    });
    if (!deck) {
      this.logger.error(`Deck with ID ${deckId} not found`);
      throw new ConflictException('Deck not found');
    }
    return deck;
  }

  /**
   * Obtener el ID de un mazo por su título
   * @param userId ID del usuario propietario del mazo
   * @param title Título del mazo a buscar
   * @returns Mazo encontrado o mensaje de error
   */

  async getDeckIdByTitle(userId: number, title: string): Promise<Deck["deckId"]> {
    const deck = await this.prisma.deck.findFirst({
      where: {
        title,
        userId,
      },
    });

    if (!deck) {
      this.logger.error(`Deck with title ${title} not found`);
      throw new NotFoundException('Deck not found');
    }

    return deck.deckId;
  }

  /**
   * Actualiza un mazo por su ID
   * @param id ID del mazo a actualizar
   * @param updateDeckDto Datos a actualizar
   * @returns Mazo actualizado o mensaje de error
   */
  async update(id: number, updateDeckDto: UpdateDeckDto) {
    return `This action updates a #${id} deck`;
  }

  /**
   * Elimina un mazo por su ID
   * @param id ID del mazo a eliminar
   * @returns Mensaje de éxito o error
   */
  async remove(id: number, user: any): Promise<string> {
    const deck = await this.prisma.deck.findFirst({
      where: {
        deckId: id,
        userId: user.id,
      },
    });

    if (!deck) {
      this.logger.error(`Deck with ID ${id} not found or does not belong to user`);
      throw new ConflictException('Deck not found');
    }

    await this.prisma.deck.delete({
      where: {
        deckId: id,
      },
    });

    this.logger.log(`Deck with ID ${id} deleted successfully`);
    return `El mazo con ID ${id} ha sido eliminado correctamente`;
  }
}