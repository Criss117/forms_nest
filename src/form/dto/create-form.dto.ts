import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateFormDto {
  @IsUUID()
  folderId: string;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  description: string;
}
