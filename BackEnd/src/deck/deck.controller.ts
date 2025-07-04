import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, NotFoundException } from '@nestjs/common';
import { DeckService } from './deck.service';
import { Deck } from './entities/deck.entity';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/JwtAuthGuard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('deck')
@Controller('deck')
export class DeckController {
  private readonly logger = new Logger(DeckController.name);
  constructor(private readonly deckService: DeckService) { }

  // CREATE DECK
  @ApiResponse({ status: 201, description: 'Deck created successfully', type: Deck })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDeckDto: CreateDeckDto, @GetUser() user: any) {
    return this.deckService.create(createDeckDto, user.userId);
  }

  // GET ALL DECKS
  @ApiResponse({ status: 200, description: 'Decks found', type: Deck })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@GetUser() user: any) {
    return this.deckService.findAll(user.userId);
  }

  // GET DECK BY ID
  @ApiResponse({ status: 200, description: 'Deck found', type: Deck })
  @UseGuards(JwtAuthGuard)
  @Get(':deckId')
  findOne(@GetUser() user: any, @Param('deckId') deckId: string) {
    return this.deckService.findOne(user.userId, +deckId);
  }

  // GET DECK ID BY TITLE
  @ApiResponse({ status: 200, description: 'Deck id found', type: Number })
  @UseGuards(JwtAuthGuard)
  @Get('by-title/:title')
  async getDeckIdByTitle(@GetUser() user: any, @Param('title') title: string) {
    const deck = await this.deckService.getDeckIdByTitle(user.userId, title);
    if (!deck) {
      throw new NotFoundException(`Deck with title ${title} not found`);
    }
    return { deckId: deck };
  }

  // UPDATE DECK BY ID
  @ApiResponse({ status: 200, description: 'Deck updated successfully', type: Deck })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update( @Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto, @GetUser() user: any) {
    return this.deckService.update(+id, updateDeckDto, user.userId);
  }

  // DELETE DECK BY ID
  @ApiResponse({ status: 200, description: 'Deck deleted successfully' })
  @UseGuards(JwtAuthGuard)
  @Delete(':deckId')
  remove(@Param('deckId') deckId: string, @GetUser() user: any) {
    return this.deckService.remove(+deckId, user);
  }
}