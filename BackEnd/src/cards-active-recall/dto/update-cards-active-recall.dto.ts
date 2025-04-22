import { PartialType } from '@nestjs/swagger';
import { CreateCardsActiveRecallDto } from './create-cards-active-recall.dto';

export class UpdateCardsActiveRecallDto extends PartialType(CreateCardsActiveRecallDto) {}
