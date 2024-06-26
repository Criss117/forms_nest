import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class VerifyEmailDto extends PickType(CreateUserDto, ['email']) {}
