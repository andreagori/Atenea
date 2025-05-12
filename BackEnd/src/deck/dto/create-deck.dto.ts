import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Deck } from "../entities/deck.entity";
import { ApiProperty, OmitType } from "@nestjs/swagger";

export class CreateDeckDto extends OmitType(Deck, [
    'deckId',
    'userId',
    'createdAt',
] as const) {
    @IsString({ message: 'title debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'title no puede estar vacío' })
    @MinLength(3, { message: 'title debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'title no puede tener más de 100 caracteres' })
    title: string;

    @ApiProperty(
        {
            description: 'Descripción del mazo',
            example: 'Este es un mazo de ejemplo.',
            minLength: 3,
            maxLength: 100,
        }
    )
    @IsString({ message: 'body debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'body no puede estar vacío' })
    @MinLength(3, { message: 'body debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'body no puede tener más de 100 caracteres' })
    body: string;
}
