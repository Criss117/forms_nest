import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class QuestionDto {
  @IsUUID()
  formId: string;

  @IsBoolean()
  required: boolean;

  @IsString()
  @MaxLength(255)
  @MinLength(5)
  question: string;

  @IsNumber()
  subtypeId: number;
}

export class AnswerDto {
  @IsNumber()
  id: number;

  @IsString()
  @MaxLength(255)
  @MinLength(5)
  answer: string;
}

export class CreateQuestionDto {
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => QuestionDto)
  question: QuestionDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  @IsNotEmpty()
  @IsOptional()
  answers: AnswerDto[];
}
