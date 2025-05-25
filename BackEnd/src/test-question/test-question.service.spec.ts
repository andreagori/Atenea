import { Test, TestingModule } from '@nestjs/testing';
import { TestQuestionService } from './test-question.service';

describe('TestQuestionService', () => {
  let service: TestQuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestQuestionService],
    }).compile();

    service = module.get<TestQuestionService>(TestQuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
