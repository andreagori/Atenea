import { Injectable } from '@nestjs/common';
import { CreateCardsActiveRecallDto } from './dto/create-cards-active-recall.dto';
import { UpdateCardsActiveRecallDto } from './dto/update-cards-active-recall.dto';

@Injectable()
export class CardsActiveRecallService {
  create(createCardsActiveRecallDto: CreateCardsActiveRecallDto) {
    return 'This action adds a new cardsActiveRecall';
  }

  findAll() {
    return `This action returns all cardsActiveRecall`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardsActiveRecall`;
  }

  update(id: number, updateCardsActiveRecallDto: UpdateCardsActiveRecallDto) {
    return `This action updates a #${id} cardsActiveRecall`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardsActiveRecall`;
  }
}
