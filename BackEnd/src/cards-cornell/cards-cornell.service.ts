import { Injectable } from '@nestjs/common';
import { CreateCardsCornellDto } from './dto/create-cards-cornell.dto';
import { UpdateCardsCornellDto } from './dto/update-cards-cornell.dto';

@Injectable()
export class CardsCornellService {
  create(createCardsCornellDto: CreateCardsCornellDto) {
    return 'This action adds a new cardsCornell';
  }

  findAll() {
    return `This action returns all cardsCornell`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardsCornell`;
  }

  update(id: number, updateCardsCornellDto: UpdateCardsCornellDto) {
    return `This action updates a #${id} cardsCornell`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardsCornell`;
  }
}
