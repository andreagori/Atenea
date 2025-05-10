import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardReviewsService } from './card-reviews.service';
import { CreateCardReviewDto } from './dto/create-card-review.dto';
import { UpdateCardReviewDto } from './dto/update-card-review.dto';

@Controller('card-reviews')
export class CardReviewsController {
  constructor(private readonly cardReviewsService: CardReviewsService) {}

  @Post()
  create(@Body() createCardReviewDto: CreateCardReviewDto) {
    return this.cardReviewsService.create(createCardReviewDto);
  }

  @Get()
  findAll() {
    return this.cardReviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardReviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardReviewDto: UpdateCardReviewDto) {
    return this.cardReviewsService.update(+id, updateCardReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardReviewsService.remove(+id);
  }
}
