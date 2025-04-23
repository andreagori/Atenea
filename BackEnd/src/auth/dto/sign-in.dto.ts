import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        description: 'Nombre de usuario',
        example: 'teresuc',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'tere321--',
    })
    @IsString()
    @IsNotEmpty()
    passwordHash: string;
}