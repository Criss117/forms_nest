import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { AuthModule } from '../auth/auth.module';
import { FolderModule } from '../folder/folder.module';

@Module({
  imports: [TypeOrmModule.forFeature([Form]), AuthModule, FolderModule],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
