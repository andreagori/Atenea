import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardsCornellService } from './cards-cornell.service';
import { CreateCardsCornellDto } from './dto/create-cards-cornell.dto';
import { UpdateCardsCornellDto } from './dto/update-cards-cornell.dto';

@Controller('cards-cornell')
export class CardsCornellController {
  constructor(private readonly cardsCornellService: CardsCornellService) {}

  @Post()
  create(@Body() createCardsCornellDto: CreateCardsCornellDto) {
    return this.cardsCornellService.create(createCardsCornellDto);
  }

  @Get()
  findAll() {
    return this.cardsCornellService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsCornellService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardsCornellDto: UpdateCardsCornellDto) {
    return this.cardsCornellService.update(+id, updateCardsCornellDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsCornellService.remove(+id);
  }
}
