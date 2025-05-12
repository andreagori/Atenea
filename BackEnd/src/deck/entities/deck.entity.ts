import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDate, IsInt, IsPositive, MinLength, MaxLength} from "class-validator";
import { Deck as Modelo } from "@prisma/client";

export class Deck implements Deck{
    @ApiProperty(
        {
            description: 'ID del mazo',
            example: 1,
        }
    )
    @IsInt({message: 'deckId debe ser un número entero'})
    @IsPositive({message: 'deckId debe ser un número positivo'})
    deckId : number;

    @ApiProperty(
        {
            description: 'ID del usuario',
            example: 1,
        }
    )
    @IsInt({message: 'userId debe ser un número entero'})
    @IsPositive({message: 'userId debe ser un número positivo'})
    userId: number;

    @ApiProperty(
        {
            description: 'Nombre del mazo',
            example: 'Mazo de Ejemplo',
            minLength: 3,
            maxLength: 100,
        }
    )
    @IsString({message: 'title debe ser una cadena de texto'})
    @IsNotEmpty({message: 'title no puede estar vacío'})
    @MinLength(3, {message: 'title debe tener al menos 3 caracteres'})
    @MaxLength(100, {message: 'title no puede tener más de 100 caracteres'})
    title: string;

    @ApiProperty(
        {
            description: 'Descripción del mazo',
            example: 'Este es un mazo de ejemplo.',
            minLength: 3,
            maxLength: 100,
        }
    )
    @IsString({message: 'body debe ser una cadena de texto'})
    @MinLength(3, {message: 'body debe tener al menos 3 caracteres'})
    @MaxLength(100, {message: 'body no puede tener más de 100 caracteres'})
    body: string | null;

    @ApiProperty(
        {
            description: 'Fecha de creación del mazo',
            example: '2021-09-01T00:00:00.000Z'
        }
    )
    @IsDate()
    createdAt: Date;
}
