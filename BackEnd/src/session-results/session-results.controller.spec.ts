import { Test, TestingModule } from '@nestjs/testing';
import { SessionResultsController } from './session-results.controller';
import { SessionResultsService } from './session-results.service';

describe('SessionResultsController', () => {
  let controller: SessionResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionResultsController],
      providers: [SessionResultsService],
    }).compile();

    controller = module.get<SessionResultsController>(SessionResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
