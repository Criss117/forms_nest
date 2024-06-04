import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { handleDBErros } from 'src/common/utils/functions';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';

@Injectable()
export class QuestionsService {
  private readonly PATH = 'QuestionService';
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly answerService: AnswersService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const { question, answers } = createQuestionDto;

    const { formId, subtypeId, ...restQuestion } = question;

    const newQuestion = this.questionRepository.create({
      ...restQuestion,
      form: { id: formId },
      subtype: { id: subtypeId },
    });

    if (!newQuestion) throw new BadRequestException('Question not created');

    let questionCreated: Question;

    try {
      questionCreated = await this.questionRepository.save(newQuestion);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }

    if (!answers) {
      return { statusCode: 200, message: 'Question created successfully' };
    }

    const answerPromise: Promise<Answer>[] = [];

    answers.forEach(async (answer) => {
      answerPromise.push(this.answerService.create(answer, questionCreated.id));
    });

    const answersCreated = await Promise.all(answerPromise);

    return {
      statusCode: 200,
      message: 'Question created successfully',
      data: {
        ...questionCreated,
        answers: answersCreated,
      },
    };
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

    const questionUpdated = await this.questionRepository.findOne({
      where: {
        id,
      },
      relations: {
        subtype: true,
      },
    });
    if (!questionUpdated) throw new NotFoundException('Question not found');
    if (!questionUpdated.active)
      throw new NotFoundException('Question not found');

    questionUpdated.question = question.question;

    try {
      this.questionRepository.save(questionUpdated);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }

    if (!answers) return { questionId: questionUpdated.id };

    const answerPromise: Promise<Answer>[] = [];

    answers.forEach(async (answer) => {
      answerPromise.push(this.answerService.create(answer, questionUpdated.id));
    });

    const answersCreated = await Promise.all(answerPromise);

    try {
      return {
        statusCode: 200,
        message: 'Question updated successfully',
        data: {
          ...questionUpdated,
          answers: answersCreated,
        },
      };
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

    // const answers = await this.answerRepository.find({
    //   where: {
    //     question: {
    //       id,
    //     },
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    // const answerPromise: Promise<Answer>[] = [];

    // answers.forEach(async (answer) => {
    //   const answerUpdated = await this.answerRepository.preload({
    //     id: answer.id,
    //     active: false,
    //   });
    //   answerPromise.push(this.answerRepository.save(answerUpdated));
    // });

    try {
      // await Promise.all(answerPromise);
      return { questionId: question.id };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }
}
