import { ApiProperty, OmitType } from "@nestjs/swagger";
import { StudySession } from "../entities/study-session.entity";
import { IsNotEmpty, IsDate, IsInt, IsPositive, IsString } from "class-validator";

export enum LearningMethod {
    ACTIVE_RECALL = 'activeRecall',
    CORNELL = 'cornell',
    VISUAL_CARD = 'visualCard',
}

export enum studyMethod {
    POMODORO = 'pomodoro',
    SIMULATED_TEST = 'simulatedTest',
    SPACED_REPETITION = 'spacedRepetition',
}

export class CreateStudySessionDto extends OmitType(StudySession, [
    'sessionId',
    'userId',
    'deckId',
]) {
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

    // POMODORO DATA:
    @ApiProperty(
        {
            description: 'Número de tarjetas a estudiar',
            example: 10,
        }
    )
    @IsInt({ message: 'numCards debe ser un número entero' })
    @IsPositive({ message: 'numCards debe ser un número positivo' })
    @IsNotEmpty({ message: 'numCards no puede estar vacío' })
    numCards: number;

    @ApiProperty(
        {
            description: 'Número de minutos de estudio',
            example: 25,
        }
    )
    @IsInt({ message: 'studyMinutes debe ser un número entero' })
    @IsPositive({ message: 'studyMinutes debe ser un número positivo' })
    @IsNotEmpty({ message: 'studyMinutes no puede estar vacío' })
    studyMinutes: number;

    @ApiProperty(
        {
            description: 'Número de minutos de descanso',
            example: 5,
        }
    )
    @IsInt({ message: 'restMinutes debe ser un número entero' })
    @IsPositive({ message: 'restMinutes debe ser un número positivo' })
    @IsNotEmpty({ message: 'restMinutes no puede estar vacío' })
    restMinutes: number;

    @ApiProperty(
        {
            description: 'Tipos de cartas a estudiar',
            example: ['activeRecall', 'cornell'],
        }
    )
    @IsNotEmpty({ message: 'learningMethodFilter no puede estar vacío' })
    @IsString({ message: 'learningMethodFilter debe ser una cadena de texto' })
    learningMethodFilter: LearningMethod;

    // SIMULATED TEST DATA:
    @ApiProperty(
        {
            description: 'Número de preguntas a responder',
            example: 10,
        }
    )
    @IsInt({ message: 'numQuestions debe ser un número entero' })
    @IsPositive({ message: 'numQuestions debe ser un número positivo' })
    @IsNotEmpty({ message: 'numQuestions no puede estar vacío' })
    numQuestions: number;

    @ApiProperty(
        {
            description: 'Duración de la prueba en minutos',
            example: 30,
        }
    )
    @IsInt({ message: 'testDuration debe ser un número entero' })
    @IsPositive({ message: 'testDuration debe ser un número positivo' })
    @IsNotEmpty({ message: 'testDuration no puede estar vacío' })
    testDurationMinutes: number;

    @ApiProperty(
        {
            description: 'Método de aprendizaje de cartas utilizado en la prueba',
            example: 'activeRecall',
        }
    )
    @IsNotEmpty({ message: 'learningMethodFilterTest no puede estar vacío' })
    @IsString({ message: 'learningMethodFilterTest debe ser una cadena de texto' })
    learningMethodFilterTest: LearningMethod;

    /* CHECK THIS:
    @ApiProperty(
        {
            description: 'Número de respuestas correctas',
            example: 8,
        }
    )
    @IsInt({ message: 'correctAnswers debe ser un número entero' })
    @IsPositive({ message: 'correctAnswers debe ser un número positivo' })
    correctAnswers: number;
    @ApiProperty(
        {
            description: 'Número de respuestas incorrectas',
            example: 2,
        }
    )
    @IsInt({ message: 'incorrectAnswers debe ser un número entero' })
    @IsPositive({ message: 'incorrectAnswers debe ser un número positivo' })
    incorrectAnswers: number;
    */

    // SPACED REPETITION DATA:
    @ApiProperty(
        {
            description: 'Número de tarjetas a estudiar',
            example: 10,
        }
    )
    @IsInt({ message: 'numCardsSpaced debe ser un número entero' })
    @IsPositive({ message: 'numCardsSpaced debe ser un número positivo' })
    numCardsSpaced: number;

    @ApiProperty(
        {
            description: 'Método de aprendizaje de cartas utilizado en la prueba',
            example: 'activeRecall',
        }
    )
    @IsNotEmpty({ message: 'learningMethodFilterTest no puede estar vacío' })
    @IsString({ message: 'learningMethodFilterTest debe ser una cadena de texto' })
    learningMethodFilterSpaced: LearningMethod;
}

