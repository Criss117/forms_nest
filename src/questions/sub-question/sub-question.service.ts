import { Injectable } from '@nestjs/common';
import { CreateSubQuestionDto } from './dto/create-sub-question.dto';
import { UpdateSubQuestionDto } from './dto/update-sub-question.dto';

@Injectable()
export class SubQuestionService {
  create(createSubQuestionDto: CreateSubQuestionDto) {
    return 'This action adds a new subQuestion';
  }

  findAll() {
    return `This action returns all subQuestion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subQuestion`;
  }

  update(id: number, updateSubQuestionDto: UpdateSubQuestionDto) {
    return `This action updates a #${id} subQuestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} subQuestion`;
  }
}
