import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeModule } from '../type/type.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeModule, ConfigModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
