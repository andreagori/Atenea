import { Test, TestingModule } from '@nestjs/testing';
import { CardReviewsService } from './card-reviews.service';

describe('CardReviewsService', () => {
  let service: CardReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardReviewsService],
    }).compile();

    service = module.get<CardReviewsService>(CardReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
