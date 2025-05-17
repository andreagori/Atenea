import { ApiProperty } from "@nestjs/swagger";
import { Card as Modelo } from "@prisma/client";
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class Card implements Card {
    @ApiProperty(
        {
            description: 'ID de la tarjeta',
            example: 1,
        }
    )
    @IsInt({ message: 'cardId debe ser un número entero' })
    @IsPositive({ message: 'cardId debe ser un número positivo' })
    @IsNotEmpty({ message: 'cardId no puede estar vacío' })
    cardId: number;

    @ApiProperty(
        {
            description: 'ID del mazo',
            example: 1,
        }
    )
    @IsInt({ message: 'deckId debe ser un número entero' })
    @IsPositive({ message: 'deckId debe ser un número positivo' })
    @IsNotEmpty({ message: 'cardId no puede estar vacío' })
    deckId: number;

    @ApiProperty(
        {
            description: 'Titulo de la carta',
            example: '¿Qué es NestJS?',
        }
    )
    @IsString({ message: 'title debe ser una cadena de texto' })
    @MaxLength(100, { message: 'title no puede tener más de 100 caracteres' })
    @MinLength(3, { message: 'title debe tener al menos 3 caracteres' })
    @IsNotEmpty({ message: 'cardId no puede estar vacío' })
    title: string;

    @ApiProperty(
        {
            description: 'Tipo de carta',
            example: 'cornell',
        }
    )
    @IsString({ message: 'learningMethod debe ser una cadena de texto' })
    @MaxLength(20, { message: 'learningMethod no puede tener más de 20 caracteres' })
    @IsNotEmpty({ message: 'cardId no puede estar vacío' })
    learningMethod: 'activeRecall' | 'cornell' | 'visualCard';
}
