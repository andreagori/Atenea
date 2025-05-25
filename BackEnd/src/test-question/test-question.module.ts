import { Module } from '@nestjs/common';
import { TestQuestionService } from './test-question.service';
import { TestQuestionController } from './test-question.controller';

@Module({
  providers: [TestQuestionService],
  controllers: [TestQuestionController]
})
export class TestQuestionModule {}
