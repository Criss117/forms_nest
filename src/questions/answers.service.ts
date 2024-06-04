import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Answer } from './entities/answer.entity';
import { AnswerDto } from './dto/create-question.dto';
import { handleDBErros } from 'src/common/utils/functions';

@Injectable()
export class AnswersService {
  private readonly PATH = 'AnswersService';

  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(answerDto: AnswerDto, questionId: number) {
    if (answerDto.id > 0) {
      return await this.update(answerDto.id, answerDto, questionId);
    }

    const newAnswer = this.answerRepository.create({
      answer: answerDto.answer,
      question: { id: questionId },
    });

    try {
      return await this.answerRepository.save(newAnswer);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async update(id: number, answerDto: AnswerDto, questionId: number) {
    const answer = await this.answerRepository.findOne({
      where: {
        id,
        question: { id: questionId },
      },
    });

    if (!answer) throw new BadRequestException('Answer not found');

    if (!answer.active) throw new BadRequestException('Answer not found');

    try {
      answer.answer = answerDto.answer;

      return await this.answerRepository.save(answer);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }
}
