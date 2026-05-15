import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Card } from './entities/card.entity';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BulkCreateCardDto } from './dto/bulk-create-card.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/JwtAuthGuard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { LearningMethod } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('card')
@UseGuards(JwtAuthGuard)
@Controller('card')
export class CardController {
  private readonly logger = new Logger(CardController.name);
  constructor(private readonly cardService: CardService,
    private readonly cloudinaryService: CloudinaryService
  ) { }


  // CREATE CARD
  @ApiResponse({ status: 201, description: 'Card created successfully', type: Card })
  @UseInterceptors(FileInterceptor('file'))
  @Post('deck/:deckId')
  async create(
    @Param('deckId') deckId: string,
    @Body() createCardDto: CreateCardDto,
    @GetUser() user: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (createCardDto.learningMethod === LearningMethod.visualCard && file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      createCardDto.urlImage = uploadResult.secure_url;
    }

    return this.cardService.create(createCardDto, +deckId, user.userId);
  }

  // BULK CREATE CARDS
  @ApiResponse({ status: 201, description: 'Cards created in bulk' })
  @Post('deck/:deckId/bulk')
  async createBulk(
    @Param('deckId') deckId: string,
    @Body() bulkCreateCardDto: BulkCreateCardDto,
    @GetUser() user: any,
  ) {
    return this.cardService.createBulk(bulkCreateCardDto, +deckId, user.userId);
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

  // UPDATE CARD BY ID
  @ApiResponse({ status: 200, description: 'Card updated successfully', type: Card })
    @UseInterceptors(FileInterceptor('file'))
    @Patch(':id/deck/:deckId')
    async update(
        @Param('id') id: string,
        @Param('deckId') deckId: string,
        @Body() updateCardDto: UpdateCardDto,
        @GetUser() user: any,
        @UploadedFile() file?: Express.Multer.File
    ) {
        // Si hay archivo, es una actualización de imagen
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file);
            updateCardDto.urlImage = uploadResult.secure_url;
        }

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