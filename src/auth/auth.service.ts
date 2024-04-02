import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtPayLoad } from './interface/jwt-payload.interface';
import { userSelectTypes } from '../user/types/user-select.types';
import { verifyPassword } from '../common/utils/functions/hashpassword';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const select: userSelectTypes = {
      id: true,
      name: true,
      surname: true,
      email: true,
      password: true,
      confirm: true,
    };

    const user = await this.userService.findOne(email, select);
    if (!user) throw new UnauthorizedException('User not found');
    this.verifyUser(password, user);

    const jwt = this.generateJWT({ id: user.id });

    const response = {
      statusCode: 200,
      message: 'Login successful',
      data: {
        email: user.email,
        name: user.name,
        surname: user.surname,
        jwt,
      },
    };

    return response;
  }

  private generateJWT(payload: JwtPayLoad) {
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }

  private verifyUser(password: string, user: User) {
    if (!user) throw new UnauthorizedException('Email or password not valid');
    if (!user.confirm) throw new UnauthorizedException('User not confirmed');
    if (!verifyPassword(password, user.password))
      throw new UnauthorizedException('Email or password not valid');
  }
}
