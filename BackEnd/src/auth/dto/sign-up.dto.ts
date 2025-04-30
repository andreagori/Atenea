import { IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}