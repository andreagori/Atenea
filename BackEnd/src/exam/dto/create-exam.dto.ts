import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({
    description:
      'ID del mazo asociado al examen. Si se omite, se debe enviar `subject` como texto libre.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'deckId debe ser un número entero' })
  deckId?: number;

  @ApiProperty({
    description:
      'Nombre de la materia/curso. Sólo necesario cuando no se asocia un mazo.',
    example: 'Anatomía',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'subject debe ser una cadena de texto' })
  @MaxLength(100, { message: 'subject no puede tener más de 100 caracteres' })
  subject?: string;

  @ApiProperty({
    description: 'Fecha del examen (ISO 8601).',
    example: '2026-03-15',
  })
  @IsNotEmpty({ message: 'examDate no puede estar vacío' })
  @IsDateString({}, { message: 'examDate debe ser una fecha ISO válida' })
  examDate: string;

  @ApiProperty({ description: 'Puntuación obtenida.', example: 85 })
  @IsNotEmpty({ message: 'examScore no puede estar vacío' })
  @IsInt({ message: 'examScore debe ser un número entero' })
  @Min(0, { message: 'examScore no puede ser negativo' })
  @Max(1000, { message: 'examScore no puede ser mayor a 1000' })
  examScore: number;

  @ApiProperty({
    description: 'Puntuación máxima posible (por defecto 100).',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'maxScore debe ser un número entero' })
  @Min(1, { message: 'maxScore debe ser al menos 1' })
  @Max(1000, { message: 'maxScore no puede ser mayor a 1000' })
  maxScore?: number;

  @ApiProperty({
    description: 'Nota opcional sobre el examen.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'note debe ser una cadena de texto' })
  @MaxLength(500, { message: 'note no puede tener más de 500 caracteres' })
  note?: string;
}
