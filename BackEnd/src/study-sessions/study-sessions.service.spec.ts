import { Test, TestingModule } from '@nestjs/testing';
import { StudySessionsService } from './study-sessions.service';

describe('StudySessionsService', () => {
  let service: StudySessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudySessionsService],
    }).compile();

    service = module.get<StudySessionsService>(StudySessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
