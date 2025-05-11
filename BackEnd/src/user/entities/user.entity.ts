import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDate, IsInt, IsPositive, MinLength, MaxLength} from "class-validator";
import { User as Modelo } from "@prisma/client";

export class User implements User{
  @ApiProperty(
    {
        description: 'ID del usuario',
        example: 1,
    }
  )
  @IsInt({message: 'userId debe ser un número entero'})
  @IsPositive({message: 'userId debe ser un número positivo'})
  userId: number; 

  @ApiProperty(
    {
        description: 'Nombre del usuario',
        example: 'Juan Perez',
        minLength: 3,
        maxLength: 50,
    }
  )
  @IsString({message: 'username debe ser una cadena de texto'})
  @IsNotEmpty({message: 'username no puede estar vacío'})
  @MinLength(3, {message: 'username debe tener al menos 3 caracteres'})
  @MaxLength(50, {message: 'username no puede tener más de 50 caracteres'})
  username: string;

  @ApiProperty(
    {
        description: 'Contraseña del usuario',
        example: 'password123',
    }
  )
  @IsString({message: 'La contraseña debe ser una cadena de texto'})
  @IsNotEmpty({message: 'La contraseña no puede estar vacía'})
  @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
  @MaxLength(50, {message: 'La contraseña no puede tener más de 50 caracteres'})
  passwordHash: string; 

  @ApiProperty(
    {
        description: 'Fecha de creacion del usuario',
        example: '2021-09-01T00:00:00.000Z'
    }
  )
  @IsDate()
  createdAt: Date;

  /* ---- Agregar las relaciones con otras tablas, es necesario hacerlas ---- 
  @ApiProperty({ type: () => [Deck] })
  decks: Deck[]; // Relación con la tabla Deck

  @ApiProperty({ type: () => [StudySession] })
  studySessions: StudySession[]; // Relación con la tabla StudySession

  @ApiProperty({ type: () => [Exam] })
  exams: Exam[]; // Relación con la tabla Exam

  @ApiProperty({ type: () => UserStats, nullable: true })
  userStats?: UserStats; // Relación opcional con la tabla UserStats
    */
}
