import { ApiProperty } from "@nestjs/swagger";
import { Evaluation, CardReview as Modelo } from "@prisma/client";
import { IsPositive, IsNotEmpty, IsInt, IsString, IsEnum, IsDate } from "class-validator";


export class CardReview implements CardReview {
    @ApiProperty({
        description: 'ID de la revisión de la carta',
        example: 1,
    })
    reviewId: number;

    @ApiProperty({
        description: 'ID de la sesion de estudio',
        example: 1,
    })
    @IsPositive({ message: 'sessionId debe ser un número positivo' })
    @IsNotEmpty({ message: 'sessionId no puede estar vacío' })
    @IsInt({ message: 'sessionId debe ser un número entero' })
    sessionId: number;

    @ApiProperty({
        description: 'ID de la carta a revisar',
        example: 1,
    })
    @IsPositive({ message: 'cardId debe ser un número positivo' })
    @IsNotEmpty({ message: 'cardId no puede estar vacío' })
    @IsInt({ message: 'cardId debe ser un número entero' })
    cardId: number;

    @ApiProperty({
        description: 'ID del usuario dueño que revisa la carta',
        example: 1,
    })
    @IsPositive({ message: 'userId debe ser un número positivo' })
    @IsNotEmpty({ message: 'userId no puede estar vacío' })
    @IsInt({ message: 'userId debe ser un número entero' })
    userId: number;

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
        description: 'Fecha de revisión de la carta',
        example: '2023-10-01T12:00:00Z',
    })
    @IsNotEmpty({ message: 'reviewedAt no puede estar vacío' })
    @IsDate({ message: 'reviewedAt debe ser una fecha' })
    reviewedAt: Date;

    @ApiProperty({
        description: 'Fecha de la próxima revisión de la carta',
        example: '2023-10-01T12:00:00Z',
    })
    @IsNotEmpty({ message: 'nextReviewAt no puede estar vacío' })
    @IsDate({ message: 'nextReviewAt debe ser una fecha' })
    nextReviewAt: Date;

    @ApiProperty({
        description: 'Intervalo de tiempo en minutos para la próxima revisión',
        example: 60,
    })
    @IsPositive({ message: 'intervalMinutes debe ser un número positivo' })
    @IsNotEmpty({ message: 'intervalMinutes no puede estar vacío' })
    @IsInt({ message: 'intervalMinutes debe ser un número entero' })
    intervalMinutes: number;

    @ApiProperty({
        description: 'Tiempo total gastado en la revisión de la carta',
        example: 60,
    })
    @IsPositive({ message: 'timeSpent debe ser un número positivo' })
    @IsInt({ message: 'timeSpent debe ser un número entero' })
    timeSpent: number | null;

}
