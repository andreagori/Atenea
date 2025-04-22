import { Test, TestingModule } from '@nestjs/testing';
import { CardsActiveRecallController } from './cards-active-recall.controller';
import { CardsActiveRecallService } from './cards-active-recall.service';

describe('CardsActiveRecallController', () => {
  let controller: CardsActiveRecallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsActiveRecallController],
      providers: [CardsActiveRecallService],
    }).compile();

    controller = module.get<CardsActiveRecallController>(CardsActiveRecallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
