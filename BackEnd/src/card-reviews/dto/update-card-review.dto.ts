import { PartialType } from '@nestjs/swagger';
import { CreateCardReviewDto } from './create-card-review.dto';

export class UpdateCardReviewDto extends PartialType(CreateCardReviewDto) {}
