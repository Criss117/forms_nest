import { Module } from '@nestjs/common';
import { QuestionModule } from './question/question.module';
import { SubQuestionModule } from './sub-question/sub-question.module';

@Module({
  imports: [QuestionModule, SubQuestionModule],
})
export class QuestionsModule {}
