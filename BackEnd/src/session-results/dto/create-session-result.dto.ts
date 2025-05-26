import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SessionResult } from '../entities/session-result.entity';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateSessionResultDto extends OmitType(SessionResult, [
    'resultId',
    'sessionId'] as const) {
    @ApiProperty({
        description: 'Puntuación obtenida en la sesión',
        minimum: 0,
        maximum: 100,
        example: 85
    })
    @IsInt()
    @Min(0)
    @Max(100)
    score: number;

    @ApiProperty({
        description: 'Fecha del resultado (opcional, por defecto now())',
        required: false
    })
    @IsOptional()
    @IsInt()
    testDate: Date;


}