import { Test, TestingModule } from '@nestjs/testing';
import { CardsActiveRecallService } from './cards-active-recall.service';

describe('CardsActiveRecallService', () => {
  let service: CardsActiveRecallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsActiveRecallService],
    }).compile();

    service = module.get<CardsActiveRecallService>(CardsActiveRecallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
