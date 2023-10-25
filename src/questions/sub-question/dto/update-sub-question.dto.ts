import { PartialType } from '@nestjs/mapped-types';
import { CreateSubQuestionDto } from './create-sub-question.dto';

export class UpdateSubQuestionDto extends PartialType(CreateSubQuestionDto) {}
