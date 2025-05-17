import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Card } from "../entities/card.entity";
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";


export enum LearningMethod {
    ACTIVE_RECALL = 'activeRecall',
    CORNELL = 'cornell',
    VISUAL_CARD = 'visualCard',
}

export class CreateCardDto extends OmitType(Card, [
    'cardId',
    'deckId',
]) {
    @ApiProperty(
        {
            description: 'Titulo de la carta',
            example: '¿Qué es NestJS?',
        }
    )
    @IsString({ message: 'title debe ser una cadena de texto' })
    @MaxLength(100, { message: 'title no puede tener más de 100 caracteres' })
    @MinLength(3, { message: 'title debe tener al menos 3 caracteres' })
    @IsNotEmpty({ message: 'title no puede estar vacío' })
    title: string;

    @IsEnum(LearningMethod)
    learningMethod: LearningMethod;

    // ACTIVE_RECALL DATA:
    @ValidateIf((o) => o.learningMethod === LearningMethod.ACTIVE_RECALL)
    @ApiProperty(
        {
            description: 'Pregunta de la carta',
            example: '¿Qué es NestJS?',
        }
    )
    @IsString({ message: 'questionTitle debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'questionTitle no puede estar vacío' })
    questionTitle: string;

    @ValidateIf((o) => o.learningMethod === LearningMethod.ACTIVE_RECALL)
    @ApiProperty(
        {
            description: 'Respuesta de la carta',
            example: 'NestJS es un framework para construir aplicaciones del lado del servidor.',
        }
    )
    @IsString({ message: 'answer debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'answer no puede estar vacío' })
    answer: string;

    // CORNELL DATA:
    @ValidateIf((o) => o.learningMethod === LearningMethod.CORNELL)
    @ApiProperty(
        {
            description: 'Nota principal de la carta',
            example: '¿Qué es NestJS?',
        }
    )
    @IsString({ message: 'principalNote debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'principalNote no puede estar vacío' })
    principalNote: string;

    @ValidateIf((o) => o.learningMethod === LearningMethod.CORNELL)
    @ApiProperty(
        {
            description: 'Nota de preguntas de la carta',
            example: '¿Qué es NestJS?',
        }
    )
    @IsString({ message: 'noteQuestions debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'noteQuestions no puede estar vacío' })
    noteQuestions: string;

    @ValidateIf((o) => o.learningMethod === LearningMethod.CORNELL)
    @ApiProperty(
        {
            description: 'Nota de resumen de la carta',
            example: '¿Qué es NestJS?',
        }
    )
    @IsString({ message: 'shortNote debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'shortNote no puede estar vacío' })
    shortNote: string;

    // VISUAL CARD DATA:
    @ValidateIf((o) => o.learningMethod === LearningMethod.VISUAL_CARD)
    @ApiProperty(
        {
            description: 'Imagen de la carta',
            example: 'https://example.com/image.jpg',
        }
    )
    @IsString({ message: 'urlImage debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'urlImage no puede estar vacío' })
    @MaxLength(250, { message: 'urlImage no puede tener más de 250 caracteres' })
    urlImage: string;
}
