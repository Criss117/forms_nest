import { UserPermissions } from 'src/common/utils/enums';

export interface HasPermissions {
  userId: number;
  folderId: string;
  formId?: string;
  isOwner: boolean;
  canRead: boolean;
  canMutate: boolean;
  permissions: UserPermissions;
}
