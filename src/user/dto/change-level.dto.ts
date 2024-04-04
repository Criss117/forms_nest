import { IsEnum, IsNumber } from 'class-validator';
import { UserLevel } from 'src/common/utils/enums';

export class ChangeLevelDto {
  @IsNumber()
  @IsEnum(UserLevel)
  level: UserLevel;
}
