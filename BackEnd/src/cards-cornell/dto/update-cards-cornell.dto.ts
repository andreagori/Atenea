import { PartialType } from '@nestjs/swagger';
import { CreateCardsCornellDto } from './create-cards-cornell.dto';

export class UpdateCardsCornellDto extends PartialType(CreateCardsCornellDto) {}
