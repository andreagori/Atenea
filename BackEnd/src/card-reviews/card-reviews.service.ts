import { Injectable } from '@nestjs/common';
import { CreateCardReviewDto } from './dto/create-card-review.dto';
import { UpdateCardReviewDto } from './dto/update-card-review.dto';

@Injectable()
export class CardReviewsService {
  create(createCardReviewDto: CreateCardReviewDto) {
    return 'This action adds a new cardReview';
  }

  findAll() {
    return `This action returns all cardReviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardReview`;
  }

  update(id: number, updateCardReviewDto: UpdateCardReviewDto) {
    return `This action updates a #${id} cardReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardReview`;
  }
}
