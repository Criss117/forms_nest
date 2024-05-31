import { Inject } from '@nestjs/common';
import { UserFolderService } from '../user-folder/user-folder.service';

/**
 * requiered @Auth() and @GetUser('id'), the order of the parameters is important, function(userId: number, folderId: string, ...rest: any)
 * add a parameter to the end of the function, userPermissions: HasPermissions
 * @returns {Function}
 */
export function GetPermissions() {
  const injectUserFolder = Inject(UserFolderService);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectUserFolder(target, 'userFolderService');
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      const userId: number = args[0];
      const folderId: string = args[1];

      const userFolderService: UserFolderService = this.userFolderService;

      const resp = await userFolderService.hasPermissions(userId, folderId);

      return await originalMethod.apply(this, [...args, resp]);
    };

    return propertyDescriptor;
  };
}
