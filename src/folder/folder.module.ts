import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { Folder } from './entities/folder.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, User]), AuthModule],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
