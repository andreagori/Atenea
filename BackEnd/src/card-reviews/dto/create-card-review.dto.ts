import { OmitType, ApiProperty } from "@nestjs/swagger";
import { IsPositive, IsNotEmpty, IsInt, IsString, IsEnum } from "class-validator";
import { CardReview } from "../entities/card-review.entity";
import { Evaluation } from "@prisma/client";


export class CreateCardReviewDto extends OmitType(CardReview, [
    'reviewId',
    'userId',
    'cardId',
    'sessionId',
    'reviewedAt',
    'nextReviewAt',
    'intervalMinutes',
] as const) {

    @ApiProperty({
        description: 'Evaluación de la carta',
        enum: Evaluation,
        example: 'dificil',
    })
    @IsNotEmpty({ message: 'evaluation no puede estar vacío' })
    @IsString({ message: 'evaluation debe ser una cadena de texto' })
    @IsEnum(Evaluation, { message: 'evaluation debe ser uno de los siguientes valores: dificil, masomenos, bien, facil' })
    evaluation: Evaluation;

    @ApiProperty({
        description: 'Tiempo gastado en la revisión de la carta (en minutos)',
        example: 5,
    })
    @IsPositive({ message: 'timeSpent debe ser un número positivo' })
    @IsInt({ message: 'timeSpent debe ser un número entero' })
    timeSpent: number | null;
}
