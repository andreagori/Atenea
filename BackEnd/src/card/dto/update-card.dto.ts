import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCardDto extends OmitType(CreateCardDto, ['learningMethod' as const]) {
    @ApiProperty({
        description: 'Archivo de imagen (opcional para actualización)',
        type: 'string',
        format: 'binary',
        required: false
    })
    @IsOptional()
    file?: Express.Multer.File;

    @ApiProperty({
        description: 'URL de la imagen actual (para referencia)',
        required: false
    })
    @IsString()
    @IsOptional()
    urlImage?: string;
}
