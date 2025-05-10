import { Test, TestingModule } from '@nestjs/testing';
import { VisualCardsController } from './visual-cards.controller';
import { VisualCardsService } from './visual-cards.service';

describe('VisualCardsController', () => {
  let controller: VisualCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisualCardsController],
      providers: [VisualCardsService],
    }).compile();

    controller = module.get<VisualCardsController>(VisualCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
