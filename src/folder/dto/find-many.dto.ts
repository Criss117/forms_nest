import { IsBoolean, IsOptional } from 'class-validator';
export class FindManyDto {
  @IsBoolean()
  @IsOptional()
  owner?: boolean;
}
