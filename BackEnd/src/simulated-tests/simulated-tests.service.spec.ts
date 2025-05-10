import { Test, TestingModule } from '@nestjs/testing';
import { SimulatedTestsService } from './simulated-tests.service';

describe('SimulatedTestsService', () => {
  let service: SimulatedTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulatedTestsService],
    }).compile();

    service = module.get<SimulatedTestsService>(SimulatedTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
