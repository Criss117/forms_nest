import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Type } from './entities/type.entity';
import { SubType } from './entities/sub-types.entity';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Type, SubType]), AuthModule],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeOrmModule],
})
export class TypeModule {}
