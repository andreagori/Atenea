import { Controller, Get, Post, Body, UseGuards, Param, Request } from '@nestjs/common';
import { CardReviewsService } from './card-reviews.service';
import { CreateCardReviewDto } from './dto/create-card-review.dto';
import { JwtAuthGuard } from '../jwt/JwtAuthGuard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('card-reviews')
@UseGuards(JwtAuthGuard)
@Controller('card-reviews')
export class CardReviewsController {
  constructor(private readonly cardReviewsService: CardReviewsService) { }

  // ENDPOINTS FOR CARD REVIEWS. CREATE A REVIEW FOR A CARD IN A SESSION.
  @ApiResponse({ status: 201, description: 'Revisión de carta creada' })
  @Post('session/:sessionId/card/:cardId')
  create(
    @Param('sessionId') sessionId: string,
    @Param('cardId') cardId: string,
    @Body() createCardReviewDto: CreateCardReviewDto,
    @Request() req
  ) {
    return this.cardReviewsService.create(
      +sessionId,
      +cardId,
      req.user.userId,
      createCardReviewDto
    );
  }

  // GET ALL REVIEWS FOR A SESSION. THIS IS USED TO DISPLAY THE REVIEWS IN THE FRONTEND.
  @ApiResponse({ status: 200, description: 'Revisión de carta encontrada' })
  @Get('session/:sessionId')
  findAllBySession(
    @Param('sessionId') sessionId: string,
    @Request() req
  ) {
    return this.cardReviewsService.findBySession(+sessionId, req.user.userId);
  }
}
