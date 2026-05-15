import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsArray } from "class-validator";

// Rows are validated per-row in the service so a bad row doesn't reject the batch.
export interface BulkCardRow {
    title?: string;
    learningMethod?: string;
    questionTitle?: string;
    answer?: string;
    principalNote?: string;
    noteQuestions?: string;
    shortNote?: string;
}

export class BulkCreateCardDto {
    @ApiProperty({ description: 'Cartas a crear en lote', type: [Object] })
    @IsArray({ message: 'cards debe ser un arreglo' })
    @ArrayMinSize(1, { message: 'Se requiere al menos una carta' })
    @ArrayMaxSize(300, { message: 'Máximo 300 cartas por carga' })
    cards: BulkCardRow[];
}
