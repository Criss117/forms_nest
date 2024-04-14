import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { UserFolderService } from './user-folder.service';
import { UserFolder } from './entities/user-folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFolder])],
  providers: [UserFolderService],
  exports: [UserFolderService],
})
export class UserFolderModule {}
