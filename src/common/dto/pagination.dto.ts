import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
