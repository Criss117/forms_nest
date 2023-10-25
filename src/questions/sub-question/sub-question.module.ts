import { Module } from '@nestjs/common';
import { SubQuestionService } from './sub-question.service';
import { SubQuestionController } from './sub-question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubQuestion } from './entities/sub-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubQuestion])],
  controllers: [SubQuestionController],
  providers: [SubQuestionService],
})
export class SubQuestionModule {}
