import { OmitType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends OmitType(CreateCardDto, ['learningMethod' as const]) {}
