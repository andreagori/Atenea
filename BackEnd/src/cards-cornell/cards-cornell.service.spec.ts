import { Test, TestingModule } from '@nestjs/testing';
import { CardsCornellService } from './cards-cornell.service';

describe('CardsCornellService', () => {
  let service: CardsCornellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsCornellService],
    }).compile();

    service = module.get<CardsCornellService>(CardsCornellService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
