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

      if (!answers) {
        return { questionId: questionCreated.id };
      }

      answers.forEach(async (answer) => {
        const newAnswer = this.answerRepository.create({
          ...answer,
          question: { id: questionCreated.id },
        });
        answerPromise.push(this.answerRepository.save(newAnswer));
      });

      await Promise.all(answerPromise);

      return { questionId: questionCreated.id };
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
    if (!questionUpdated.active)
      throw new NotFoundException('Question not found');

    try {
      this.questionRepository.save(questionUpdated);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }

    if (!answers) return { questionId: questionUpdated.id };

    const answerPromise: Promise<Answer>[] = [];

    answers.forEach(async (answer) => {
      if (!answer.id) {
        const answerUpdated = this.answerRepository.create({
          ...answer,
          question: { id: questionUpdated.id },
        });
        answerPromise.push(this.answerRepository.save(answerUpdated));
      }
      if (answer.id && answer.id > 0) {
        const answerUpdated = await this.answerRepository.preload({
          id: answer.id,
          ...answer,
        });
        answerPromise.push(this.answerRepository.save(answerUpdated));
      }
      if (answer.id && answer.id < 0) {
        const answerUpdated = await this.answerRepository.preload({
          id: answer.id * -1,
          active: false,
        });
        answerPromise.push(this.answerRepository.save(answerUpdated));
      }
    });

    try {
      await Promise.all(answerPromise);
      return { questionId: questionUpdated.id };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async delete(id: number) {
    const question = await this.questionRepository.preload({
      id,
      active: false,
    });

    if (!question) throw new NotFoundException('Question not found');

    try {
      this.questionRepository.save(question);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }

    const answers = await this.answerRepository.find({
      where: {
        question: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    const answerPromise: Promise<Answer>[] = [];

    answers.forEach(async (answer) => {
      const answerUpdated = await this.answerRepository.preload({
        id: answer.id,
        active: false,
      });
      answerPromise.push(this.answerRepository.save(answerUpdated));
    });

    try {
      await Promise.all(answerPromise);
      return { questionId: question.id };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }
}
