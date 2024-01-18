import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { handleDBErros } from 'src/common/utils/functions';
import { Answer } from './entities/answer.entity';

@Injectable()
export class QuestionsService {
  private readonly PATH = 'QuestionService';
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const { question, answers } = createQuestionDto;

    try {
      const { formId, subtypeId, ...restQuestion } = question;
      const newQuestion = this.questionRepository.create({
        ...restQuestion,
        form: { id: formId },
        subtype: { id: subtypeId },
      });

      const questionCreated = await this.questionRepository.save(newQuestion);

      if (!questionCreated) throw new Error('Question not created');

      const answerPromise: Promise<Answer>[] = [];

      answers.forEach(async (answer) => {
        const newAnswer = this.answerRepository.create({
          ...answer,
          question: { id: questionCreated.id },
        });
        answerPromise.push(this.answerRepository.save(newAnswer));
      });

      await Promise.all(answerPromise);

      return { statusCode: 200, message: 'Question created successfully' };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findAllbyFormId(formId: string) {
    const questions = await this.questionRepository.find({
      where: {
        form: {
          id: formId,
        },
      },
      relations: {
        answers: true,
      },
    });
    return questions;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const { answers, question } = updateQuestionDto;

    const questionUpdated = await this.questionRepository.preload({
      id,
      ...question,
    });
    if (!questionUpdated) throw new NotFoundException('Question not found');

    try {
      this.questionRepository.save(questionUpdated);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }

    if (!answers) return { statusCode: 200, message: 'Question updated' };

    const answerPromise: Promise<Answer>[] = [];

    answers.forEach(async (answer) => {
      if (!answer.id) {
        const answerUpdated = this.answerRepository.create({
          ...answer,
          question: { id: questionUpdated.id },
        });
        answerPromise.push(this.answerRepository.save(answerUpdated));
      } else {
        const answerUpdated = await this.answerRepository.preload({
          id: answer.id,
          ...answer,
        });
        answerPromise.push(this.answerRepository.save(answerUpdated));
      }
    });

    try {
      await Promise.all(answerPromise);
      return { statusCode: 200, message: 'Question updated successfully' };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }
}
