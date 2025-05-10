import { Test, TestingModule } from '@nestjs/testing';
import { VisualCardsService } from './visual-cards.service';

describe('VisualCardsService', () => {
  let service: VisualCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisualCardsService],
    }).compile();

    service = module.get<VisualCardsService>(VisualCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
