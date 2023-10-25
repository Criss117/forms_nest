import { IsString, Length } from 'class-validator';

export class ConfirmAccountDto {
  @IsString()
  @Length(19)
  token: string;
}
