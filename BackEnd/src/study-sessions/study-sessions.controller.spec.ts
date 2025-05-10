import { Test, TestingModule } from '@nestjs/testing';
import { StudySessionsController } from './study-sessions.controller';
import { StudySessionsService } from './study-sessions.service';

describe('StudySessionsController', () => {
  let controller: StudySessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudySessionsController],
      providers: [StudySessionsService],
    }).compile();

    controller = module.get<StudySessionsController>(StudySessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
