import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { UserPermissions } from 'src/common/utils/enums';

export class CreateUserFolderDto {
  @IsNumber()
  userId: number;

  @IsUUID()
  folderId: string;

  @IsEnum(UserPermissions)
  permission: UserPermissions;
}
