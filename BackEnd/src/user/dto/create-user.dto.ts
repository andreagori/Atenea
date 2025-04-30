import { IsString } from "class-validator";
import { User } from "../entities/user.entity";
import { OmitType } from "@nestjs/swagger";

// Este DTO se utiliza para crear un nuevo usuario y omite los campos que no son necesarios al crear un usuario.
// Se omiten los campos userId y createdAt, ya que son generados automáticamente por la base de datos.
export class CreateUserDto extends OmitType (User, [
    'userId',
    'createdAt',
    'passwordHash'
] as const){
    @IsString()
    password: string; 
}
