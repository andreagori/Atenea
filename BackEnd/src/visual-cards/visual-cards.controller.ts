import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VisualCardsService } from './visual-cards.service';
import { CreateVisualCardDto } from './dto/create-visual-card.dto';
import { UpdateVisualCardDto } from './dto/update-visual-card.dto';

@Controller('visual-cards')
export class VisualCardsController {
  constructor(private readonly visualCardsService: VisualCardsService) {}

  @Post()
  create(@Body() createVisualCardDto: CreateVisualCardDto) {
    return this.visualCardsService.create(createVisualCardDto);
  }

  @Get()
  findAll() {
    return this.visualCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visualCardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisualCardDto: UpdateVisualCardDto) {
    return this.visualCardsService.update(+id, updateVisualCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visualCardsService.remove(+id);
  }
}
