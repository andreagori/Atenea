import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardsActiveRecallService } from './cards-active-recall.service';
import { CreateCardsActiveRecallDto } from './dto/create-cards-active-recall.dto';
import { UpdateCardsActiveRecallDto } from './dto/update-cards-active-recall.dto';

@Controller('cards-active-recall')
export class CardsActiveRecallController {
  constructor(private readonly cardsActiveRecallService: CardsActiveRecallService) {}

  @Post()
  create(@Body() createCardsActiveRecallDto: CreateCardsActiveRecallDto) {
    return this.cardsActiveRecallService.create(createCardsActiveRecallDto);
  }

  @Get()
  findAll() {
    return this.cardsActiveRecallService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsActiveRecallService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardsActiveRecallDto: UpdateCardsActiveRecallDto) {
    return this.cardsActiveRecallService.update(+id, updateCardsActiveRecallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsActiveRecallService.remove(+id);
  }
}
