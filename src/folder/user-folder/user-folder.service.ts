import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserFolderDto } from './dto/create-user-folder.dto';
import { UpdateUserFolderDto } from './dto/update-user-folder.dto';
import { UserFolder } from './entities/user-folder.entity';
import { handleDBErros } from 'src/common/utils/functions';

@Injectable()
export class UserFolderService {
  private readonly PATH = 'UserFolderService';
  constructor(
    @InjectRepository(UserFolder)
    private userFolderRepository: Repository<UserFolder>,
  ) {}

  async create(createUserFolderDto: CreateUserFolderDto) {
    try {
      const newUserFolder = this.userFolderRepository.create({
        user: {
          id: createUserFolderDto.userId,
        },
        folder: {
          id: createUserFolderDto.folderId,
        },
        permissions: createUserFolderDto.permission,
      });

      await this.userFolderRepository.save(newUserFolder);
      return {
        statusCode: 201,
        message: 'UserFolder created successfully',
        data: newUserFolder,
      };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
    return 'This action adds a new userFolder';
  }

  findAll() {
    return `This action returns all userFolder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFolder`;
  }

  update(id: number, updateUserFolderDto: UpdateUserFolderDto) {
    return `This action updates a #${id} userFolder`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFolder`;
  }
}
