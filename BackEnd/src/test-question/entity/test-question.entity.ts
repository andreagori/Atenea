import { ApiProperty } from "@nestjs/swagger";
import { TestQuestion as Modelo } from "@prisma/client";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class TestQuestion implements TestQuestion {
    @ApiProperty(
        {
            description: 'ID de la pregunta del test',
            example: 1,
        }
    )
    @IsInt({ message: 'questionId debe ser un número entero' })
    @IsPositive({ message: 'questionId debe ser un número positivo' })
    @IsNotEmpty({ message: 'questionId no puede estar vacío' })
    questionId: number;

    @ApiProperty(
        {
            description: 'ID del test',
            example: 1,
        }
    )
    @IsInt({ message: 'testId debe ser un número entero' })
    @IsPositive({ message: 'testId debe ser un número positivo' })
    @IsNotEmpty({ message: 'testId no puede estar vacío' })
    testId: number;

    @ApiProperty(
        {
            description: 'ID de la carta',
            example: 1,
        }
    )
    @IsInt({ message: 'cardId debe ser un número entero' })
    @IsPositive({ message: 'cardId debe ser un número positivo' })
    @IsNotEmpty({ message: 'cardId no puede estar vacío' })
    cardId: number;

    @ApiProperty(
        {
            description:'Respuesta del usuario',
            example: 1,
        }
    )
    @IsInt({ message: 'userAnswer debe ser un número entero' })
    @IsPositive({ message: 'userAnswer debe ser un número positivo' })
    @IsNotEmpty({ message: 'userAnswer no puede estar vacío' })
    userAnswer: number

    @ApiProperty(
        {
            description:'Respuesta correcta',
            example: 1,
        }
    )
    @IsBoolean({ message: 'correctAnswer debe ser un booleano' })
    @IsPositive({ message: 'correctAnswer debe ser un número positivo' })
    @IsNotEmpty({ message: 'correctAnswer no puede estar vacío' })
    isCorrect: boolean;

    @ApiProperty(
        {
            description: 'Orden de las opciones de respuesta',
            example: [1, 2, 3, 4],
        }
    )
    @IsArray({ message: 'optionsOrder debe ser un arreglo' })
    @IsNotEmpty({ message: 'optionsOrder no puede estar vacío' })
    optionsOrder: number[];
    @ApiProperty(
        {
            description: 'Tiempo que el usuario ha pasado en la pregunta',
            example: 30,
        }
    )
    @IsInt({ message: 'timeSpent debe ser un número entero' })
    @IsPositive({ message: 'timeSpent debe ser un número positivo' })
    timeSpent: number;
}