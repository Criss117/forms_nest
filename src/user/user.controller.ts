import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangeLevelDto,
  ConfirmAccountDto,
  CreateUserDto,
  VerifyEmailDto,
} from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Auth, GetUser } from '../auth/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('confirm')
  confirm(@Body() confirmAccountDto: ConfirmAccountDto) {
    return this.userService.confirm(confirmAccountDto);
  }

  @Patch('verify')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.userService.verifyEmail(verifyEmailDto);
  }

  @Patch('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(changePasswordDto);
  }

  @Patch('change-level')
  @Auth()
  changeLevel(
    @Body() changeLevelDto: ChangeLevelDto,
    @GetUser('id') userId: number,
  ) {
    return this.userService.changeLevel(userId, changeLevelDto);
  }

  @Get('is-authenticated')
  @Auth()
  isAuthenticated() {
    return true;
  }
}
