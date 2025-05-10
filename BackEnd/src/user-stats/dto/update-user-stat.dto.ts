import { PartialType } from '@nestjs/swagger';
import { CreateUserStatDto } from './create-user-stat.dto';

export class UpdateUserStatDto extends PartialType(CreateUserStatDto) {}
