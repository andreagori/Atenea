import { Test, TestingModule } from '@nestjs/testing';
import { CardReviewsController } from './card-reviews.controller';
import { CardReviewsService } from './card-reviews.service';

describe('CardReviewsController', () => {
  let controller: CardReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardReviewsController],
      providers: [CardReviewsService],
    }).compile();

    controller = module.get<CardReviewsController>(CardReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
