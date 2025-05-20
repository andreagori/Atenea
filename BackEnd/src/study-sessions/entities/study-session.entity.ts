import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { StudySession as Modelo } from "@prisma/client";
import { IsDate, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class StudySession implements StudySession {
    @ApiProperty(
        {
            description: 'ID de la sesión de estudio',
            example: 1,
        }
    )
    @IsInt({ message: 'studySessionId debe ser un número entero' })
    @IsPositive({ message: 'studySessionId debe ser un número positivo' })
    @IsNotEmpty({ message: 'studySessionId no puede estar vacío' })
    sessionId: number;

    @ApiProperty(
        {
            description: 'ID del mazo',
            example: 1,
        }
    )
    @IsInt({ message: 'userId debe ser un número entero' })
    @IsPositive({ message: 'userId debe ser un número positivo' })
    @IsNotEmpty({ message: 'userId no puede estar vacío' })
    userId: number;

    @ApiProperty(
        {
            description: 'ID del mazo',
            example: 1,
        }
    )
    @IsInt({ message: 'deckId debe ser un número entero' })
    @IsPositive({ message: 'deckId debe ser un número positivo' })
    @IsNotEmpty({ message: 'deckId no puede estar vacío' })
    deckId: number;

    @ApiProperty(
        {
            description: 'Tiempo de inicio de la sesión de estudio',
            example: '2023-10-01T12:00:00Z',
        }
    )
    @IsNotEmpty({ message: 'startTime no puede estar vacío' })
    @IsDate({ message: 'startTime debe ser una fecha' })
    startTime: Date;

    @ApiProperty(
        {
            description: 'Tiempo de fin de la sesión de estudio',
            example: '2023-10-01T13:00:00Z',
        }
    )
    @IsNotEmpty({ message: 'endTime no puede estar vacío' })
    @IsDate({ message: 'endTime debe ser una fecha' })
    endTime: Date;

    @ApiProperty(
        {
            description: 'Duración de la sesión de estudio en minutos',
            example: 60,
        }
    )
    @IsInt({ message: 'duration debe ser un número entero' })
    @IsPositive({ message: 'duration debe ser un número positivo' })
    @IsNotEmpty({ message: 'duration no puede estar vacío' })
    minDuration: number;

    @ApiProperty(
        {
            description: 'Método de aprendizaje de cartas utilizado en la sesión de estudio',
            example: 'activeRecall',
        }
    )
    @IsNotEmpty({ message: 'learningMethod no puede estar vacío' })
    @IsString({ message: 'learningMethod debe ser una cadena de texto' })
    learningMethod: 'activeRecall' | 'cornell' | 'visualCard';

    @ApiProperty(
        {
            description: 'Método de estudio utilizado en la sesión de estudio',
            example: 'pomodoro',
        }
    )
    @IsNotEmpty({ message: 'studyMethod no puede estar vacío' })
    @IsString({ message: 'studyMethod debe ser una cadena de texto' })
    studyMethod: 'pomodoro' | 'simulatedTest' | 'spacedRepetition';
}
