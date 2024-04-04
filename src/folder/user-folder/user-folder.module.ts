import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { UserFolderService } from './user-folder.service';
import { UserFolderController } from './user-folder.controller';
import { UserFolder } from './entities/user-folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFolder])],
  controllers: [UserFolderController],
  providers: [UserFolderService],
  exports: [UserFolderService],
})
export class UserFolderModule {}
