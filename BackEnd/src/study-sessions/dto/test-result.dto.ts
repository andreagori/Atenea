import { ApiProperty } from '@nestjs/swagger';

export class TestResultDto {
    @ApiProperty()
    sessionId: number;

    @ApiProperty()
    correctAnswers: number;

    @ApiProperty()
    incorrectAnswers: number;

    @ApiProperty()
    score: number;

    @ApiProperty()
    timeSpent: number;
}