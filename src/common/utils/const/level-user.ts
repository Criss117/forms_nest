import { UserLevel } from '../enums';

export const LEVEL_USER = {
  [UserLevel.LEVEL1]: {
    folderLimit: 5,
    formLimit: 5,
  },
  [UserLevel.LEVEL2]: {
    folderLimit: 10,
    formLimit: 10,
  },
  [UserLevel.LEVEL3]: {
    folderLimit: 20,
    formLimit: 20,
  },
};
