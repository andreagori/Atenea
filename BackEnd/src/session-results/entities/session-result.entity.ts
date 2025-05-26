import { ApiProperty } from "@nestjs/swagger";
import { SessionsResult as Modelo } from "@prisma/client";
import { IsDate, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class SessionResult implements SessionResult {
    @ApiProperty(
        {
            description: 'ID del resultado de la sesión',
            example: 1,
        }
    )
    @IsInt({ message: 'resultId debe ser un número entero' })
    @IsPositive({ message: 'resultId debe ser un número positivo' })
    @IsNotEmpty({ message: 'resultId no puede estar vacío' })
    resultId: number;

    @ApiProperty(
        {
            description: 'ID de la sesión',
            example: 1,
        }
    )
    @IsInt({ message: 'sessionId debe ser un número entero' })
    @IsPositive({ message: 'sessionId debe ser un número positivo' })
    @IsNotEmpty({ message: 'sessionId no puede estar vacío' })
    sessionId: number;

    @ApiProperty(
        {
            description: 'Puntuación obtenida en la sesión',
            minimum: 0,
            maximum: 100,
            example: 85
        }
    )
    @IsInt({ message: 'score debe ser un número entero' })
    @IsPositive({ message: 'score debe ser un número positivo' })
    @MinLength(0, { message: 'score debe ser al menos 0' })
    score: number;

    @ApiProperty({
        description: 'Fecha del resultado (opcional, por defecto now())',
        required: false,
        type: Date,
        example: '2023-10-01T12:00:00Z'
    })
    @IsDate({ message: 'testDate debe ser una fecha válida' })
    testDate: Date;

}
