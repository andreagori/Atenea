import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class TimeRangeDto {
  @ApiProperty({ description: 'Número de días hacia atrás', example: 30, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  days?: number = 30;

  @ApiProperty({ description: 'Fecha de inicio (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Fecha de fin (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class DeckAnalyticsDto {
  @ApiProperty({ description: 'ID del deck específico', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  deckId?: number;
}