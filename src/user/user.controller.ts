import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, VerifyEmail } from './dto';
import { ChangePassword } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('confirm/:token')
  confirm(@Param('token') token: string) {
    return this.userService.confirm(token);
  }

  @Patch('verify')
  verifyEmail(@Body() email: VerifyEmail) {
    return this.userService.verifyEmail(email);
  }

  @Patch('change-password')
  changePassword(@Body() userData: ChangePassword) {
    return this.userService.changePassword(userData);
  }

  @Get(':prm')
  @HttpCode(200)
  findOne(@Param('prm') prm: string) {
    return this.userService.findOne(prm);
  }
}
