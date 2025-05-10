import { PartialType } from '@nestjs/swagger';
import { CreateVisualCardDto } from './create-visual-card.dto';

export class UpdateVisualCardDto extends PartialType(CreateVisualCardDto) {}
