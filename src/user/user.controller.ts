import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, VerifyEmail } from './dto';
import { ChangePassword } from './dto/change-password.dto';
import { Auth } from '../auth/decorators';

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

  @Get('is-authenticated')
  @Auth()
  isAuthenticated() {
    return true;
  }
}
