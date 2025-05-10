import { Test, TestingModule } from '@nestjs/testing';
import { SessionResultsService } from './session-results.service';

describe('SessionResultsService', () => {
  let service: SessionResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionResultsService],
    }).compile();

    service = module.get<SessionResultsService>(SessionResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
