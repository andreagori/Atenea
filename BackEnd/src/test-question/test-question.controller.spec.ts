import { Test, TestingModule } from '@nestjs/testing';
import { TestQuestionController } from './test-question.controller';

describe('TestQuestionController', () => {
  let controller: TestQuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestQuestionController],
    }).compile();

    controller = module.get<TestQuestionController>(TestQuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
