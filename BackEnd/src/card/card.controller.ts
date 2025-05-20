import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards } from '@nestjs/common';
import { Card } from './entities/card.entity';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/JwtAuthGuard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('card')
@UseGuards(JwtAuthGuard)
@Controller('card')
export class CardController {
  private readonly logger = new Logger(CardController.name);
  constructor(private readonly cardService: CardService) { }


  // CREATE CARD
  @ApiResponse({ status: 201, description: 'Card created successfully', type: Card })
  @Post('deck/:deckId')
  create(
    @Param('deckId') deckId: string,
    @Body() createCardDto: CreateCardDto,
    @GetUser() user: any,
  ) {
    return this.cardService.create(createCardDto, +deckId, user.userId);
  }

  // GET ALL CARDS
  @ApiResponse({ status: 200, description: 'Cards found', type: Card })
  @Get('deck/:deckId')
  findAll(@Param('deckId') deckId: string, @GetUser() user: any) {
    return this.cardService.findAll(+deckId, user.userId);
  }

  // GET CARD BY ID
  @ApiResponse({ status: 200, description: 'Card found', type: Card })
  @Get(':id/deck/:deckId')
  findOne(
    @Param('id') id: string,
    @Param('deckId') deckId: string,
    @GetUser() user: any,
  ) {
    return this.cardService.findOne(+id, +deckId, user.userId);
  }

  @ApiResponse({ status: 200, description: 'Card updated successfully', type: Card })
  @Patch(':id/deck/:deckId')
  update(
    @Param('id') id: string,
    @Param('deckId') deckId: string,
    @Body() updateCardDto: UpdateCardDto,
    @GetUser() user: any,
  ) {
    return this.cardService.update(+id, +deckId, user.userId, updateCardDto);
  }

  // DELETE CARD BY ID
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  @Delete(':id/deck/:deckId')
  remove(
    @Param('id') id: string,
    @Param('deckId') deckId: string,
    @GetUser() user: any,
  ) {
    return this.cardService.remove(+id, +deckId, user.userId);
  }
}