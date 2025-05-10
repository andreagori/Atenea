import { Test, TestingModule } from '@nestjs/testing';
import { SimulatedTestsController } from './simulated-tests.controller';
import { SimulatedTestsService } from './simulated-tests.service';

describe('SimulatedTestsController', () => {
  let controller: SimulatedTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatedTestsController],
      providers: [SimulatedTestsService],
    }).compile();

    controller = module.get<SimulatedTestsController>(SimulatedTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
