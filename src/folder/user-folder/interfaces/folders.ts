import { Folder } from 'src/folder/entities/folder.entity';

export interface UserFolders extends Folder {
  owner: boolean;
}
