import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString } from "class-validator";
import { User as Model } from "@prisma/client";

export class User implements User{
  @ApiProperty()
  userId: number; 

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passwordHash: string; 

  @ApiProperty()
  @IsDateString()
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
