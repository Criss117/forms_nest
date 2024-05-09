import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AnswersService } from './answers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer]), AuthModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, AnswersService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
