import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class UserService {
  // Logger for the UserService class, which is used to log messages and errors.
  private readonly logger = new Logger(UserService.name);
  // PrismaService instance for database operations.
  constructor(private readonly prisma: PrismaService) { }

  /**
 * Crea un usuario y valida que el username no se repita
 * @param createUserDto 
 * @returns Usuario creado o mensaje de error
 */

  async create(createUserDto: CreateUserDto) {
    const usernameExists = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
    });

    if (usernameExists) {
      this.logger.error(`Username ${createUserDto.username} already exists`);
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); 

    return await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        passwordHash: hashedPassword, 
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  /**
   * Busca un usuario por su ID
   * @param id ID del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { userId: id },
    });
  }

  /**
   * Busca un usuario por su username
   * @param username Username del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      this.logger.warn(`Usuario con username "${username}" no encontrado`);
      return null;
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<string> {
    // ensure the user exists before attempting to delete
    const user = await this.prisma.user.findUnique({ where: { userId: id } });
    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new Error(`User with id ${id} not found`);
    }
    // delete the user and return the deleted user object
    const deletedUser = await this.prisma.user.delete(
      {
        where: { userId: id }
      });
    this.logger.log(`User with id ${id} deleted`);

    return `El usuario con ID ${id} ha sido eliminado correctamente`;
  }
}
