import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string;
}
