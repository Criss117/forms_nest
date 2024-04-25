import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  generateToken,
  handleDBErros,
  hashpassword,
  tokenExpired,
} from '../common/utils/functions';
import {
  ChangeLevelDto,
  ChangePasswordDto,
  ConfirmAccountDto,
  CreateUserDto,
  VerifyEmailDto,
} from './dto';
import { userSelectTypes } from './types/user-select.types';
import { User } from './entities/user.entity';
import { FolderService } from '../folder/folder.service';
import { newUserFolder } from '../common/utils/const';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UserService {
  private readonly PATH = 'UserService';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly folderService: FolderService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = this.userRepository.create({
        ...userData,
        token: generateToken(),
        password: hashpassword(password),
      });
      await this.userRepository.save(newUser);
      //TODO: send email

      return { statusCode: 201, message: 'User created successfully' };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async confirm(confirmAccountDto: ConfirmAccountDto) {
    const user = await this.userRepository.findOne({
      where: { token: confirmAccountDto.token },
    });

    if (!user) throw new BadRequestException('User not found');

    if (user.confirm)
      throw new ConflictException('The user is already confirmed');

    if (tokenExpired(user.tokenExpiration)) {
      await this.userRepository.remove(user);
      throw new UnauthorizedException(
        'Token has expired please create an account again',
      );
    }

    user.confirm = true;
    user.token = '';

    try {
      await this.userRepository.save(user);
      await this.folderService.create(newUserFolder, user.id);
      return { statusCode: 200, message: 'User confirmed successfully' };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findOne(prm: number | string, select?: userSelectTypes) {
    let user: User;
    if (!isNaN(+prm)) {
      user = await this.userRepository.findOne({ where: { id: +prm }, select });
      return user;
    }

    if (typeof prm === 'string') {
      user = await this.userRepository.findOne({
        where: { email: prm },
        select,
      });
      return user;
    }

    if (!user) throw new NotFoundException('User not found');
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.findOne(verifyEmailDto.email);

    if (!user) throw new NotFoundException('User not found');
    if (!user.confirm) throw new UnauthorizedException('User not authorized');
    if (user.token.length > 0 && user.confirm)
      throw new ConflictException('The token has already been generated');

    user.token = generateToken();
    user.tokenExpiration = new Date(Date.now() + 1000 * 60 * 10);

    await this.userRepository.save(user);
    return {
      statusCode: 200,
      message: 'The email has been verified and token created correctly',
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const newUser = await this.userRepository.findOneBy({
      token: changePasswordDto.token,
    });

    if (!newUser) throw new BadRequestException('User not found');
    if (!newUser.confirm)
      throw new ConflictException('The user is not confirmed');

    if (tokenExpired(newUser.tokenExpiration)) {
      newUser.token = '';
      try {
        await this.userRepository.save(newUser);
      } catch (error) {
        handleDBErros(error, this.PATH);
      }
      throw new UnauthorizedException('Token has expired');
    }

    newUser.password = hashpassword(changePasswordDto.password);
    newUser.token = '';

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
    return { statusCode: 200, message: 'Password updated successfully' };
  }

  async changeLevel(userId: number, changeLevelDto: ChangeLevelDto) {
    const user = await this.findOne(userId);
    user.level = changeLevelDto.level;
    try {
      await this.userRepository.save(user);
      const response = {
        statusCode: 200,
        message: 'User level updated successfully',
        data: user,
      };

      return response;
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findUsersByEmail(findUsersDto: FindUsersDto, userId: number) {
    const { query } = findUsersDto;

    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id != :id', { id: userId })
        .andWhere(`user.name LIKE :query`, { query: `%${query}%` })
        .orWhere('user.email LIKE :query', { query: `%${query}%` })
        .orWhere('user.surname LIKE :query', { query: `%${query}%` })
        .getMany();

      const response = {
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: users.filter((user) => user.id !== userId),
      };

      return response;
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  sayHello() {
    return 'hola';
  }
}
