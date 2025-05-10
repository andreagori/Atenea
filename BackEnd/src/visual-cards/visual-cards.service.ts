import { Injectable } from '@nestjs/common';
import { CreateVisualCardDto } from './dto/create-visual-card.dto';
import { UpdateVisualCardDto } from './dto/update-visual-card.dto';

@Injectable()
export class VisualCardsService {
  create(createVisualCardDto: CreateVisualCardDto) {
    return 'This action adds a new visualCard';
  }

  findAll() {
    return `This action returns all visualCards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visualCard`;
  }

  update(id: number, updateVisualCardDto: UpdateVisualCardDto) {
    return `This action updates a #${id} visualCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} visualCard`;
  }
}
