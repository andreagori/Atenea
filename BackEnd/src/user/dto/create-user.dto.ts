import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { User } from "../entities/user.entity";
import { ApiProperty, OmitType } from "@nestjs/swagger";

// Este DTO se utiliza para crear un nuevo usuario y omite los campos que no son necesarios al crear un usuario.
// Se omiten los campos userId y createdAt, ya que son generados automáticamente por la base de datos.
export class CreateUserDto extends OmitType(User, [
    'userId',
    'createdAt',
    'passwordHash'
] as const) {
    @ApiProperty(
        {
            description: 'Nombre del usuario',
            example: 'Juan Perez',
            minLength: 3,
            maxLength: 50,
        }
    )
    @IsString({ message: 'username debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'username no puede estar vacío' })
    @MinLength(3, { message: 'username debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'username no puede tener más de 50 caracteres' })
    username: string;

    @ApiProperty(
        {
            description: 'Contraseña del usuario',
            example: 'password123',
            minLength: 8,
            maxLength: 50,
        }
    )
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @Matches(/^(?=.*\d).+$/, { message: 'La contraseña debe contener al menos un número' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(50, { message: 'La contraseña no puede tener más de 50 caracteres' })
    password: string;
}
