import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { FolderModule } from './folder/folder.module';
import { TypeModule } from './type/type.module';
import { SeedModule } from './seed/seed.module';
import { FormModule } from './form/form.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    UserModule,
    CommonModule,
    AuthModule,
    FolderModule,
    TypeModule,
    SeedModule,
    FormModule,
    QuestionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
