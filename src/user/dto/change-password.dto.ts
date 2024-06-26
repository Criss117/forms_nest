import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto extends PickType(CreateUserDto, ['password']) {
  @IsString()
  @Length(19)
  token: string;
}
