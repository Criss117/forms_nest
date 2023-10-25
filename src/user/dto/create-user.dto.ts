import {
  Max,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
  IsPositive,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @MinLength(4)
  surname: string;

  @IsString()
  @IsEmail()
  @MinLength(10)
  @MaxLength(320)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsNumber()
  @IsPositive()
  @Max(9999999999)
  phone: number;
}
