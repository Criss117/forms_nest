import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FindUsersDto {
  @IsString()
  @MinLength(2)
  @IsString()
  @MaxLength(320)
  query: string;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  page: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  limit: number;
}
