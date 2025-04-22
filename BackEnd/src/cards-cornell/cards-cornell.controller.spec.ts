import { Test, TestingModule } from '@nestjs/testing';
import { CardsCornellController } from './cards-cornell.controller';
import { CardsCornellService } from './cards-cornell.service';

describe('CardsCornellController', () => {
  let controller: CardsCornellController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsCornellController],
      providers: [CardsCornellService],
    }).compile();

    controller = module.get<CardsCornellController>(CardsCornellController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
