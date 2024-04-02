import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Folder } from './entities/folder.entity';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import { handleDBErros } from '../common/utils/functions';
import { PaginationDto } from '../common/dto/pagination.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FolderService {
  private readonly PATH = 'FolderService';
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createFolderDto: CreateFolderDto, userId: number) {
    await this.verifyUserFolderLimit(userId);

    try {
      const newFolder = this.folderRepository.create({
        ...createFolderDto,
        user: { id: userId },
      });

      await this.folderRepository.save(newFolder);

      return {
        statusCode: 201,
        message: 'Folder created successfully',
        data: {
          ...newFolder,
          formCount: 0,
        },
      };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findManyByUserId(userId: number, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const folders = await this.folderRepository
        .createQueryBuilder('folder')
        .skip(offset)
        .take(limit)
        .orderBy('folder.createdAt', 'DESC')
        .leftJoin('folder.forms', 'form')
        .loadRelationCountAndMap('folder.formCount', 'folder.forms')
        .where({ user: { id: userId } })
        .getMany();

      const response = {
        statuscode: 200,
        message: 'Folders retrieved successfully',
        data: folders,
      };

      return response;
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findOne(id: string, userId: number) {
    const folder = await this.folderRepository
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.forms', 'form', 'form.active = :active', {
        active: true,
      })
      .where({ id, user: { id: userId } })
      .getOne();

    if (!folder) throw new ForbiddenException('Unauthorized user');

    return folder;
  }

  async update(id: string, updateFolderDto: UpdateFolderDto, userId: number) {
    const folder = await this.findOne(id, userId);
    const newFolder = {
      ...folder,
      ...updateFolderDto,
    };

    try {
      return await this.folderRepository.save(newFolder);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async delete(id: string, userId: number) {
    const folder = await this.folderRepository.preload({
      id,
      user: { id: userId },
    });
    if (!folder) throw new NotFoundException('Folder not found');
    try {
      folder.active = false;
      await this.folderRepository.save(folder);
      return folder.id;
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async verifyUserFolderLimit(userId: number) {
    const folders = this.folderRepository.count({
      where: {
        user: {
          id: userId,
        },
      },
    });

    const limitFolders = this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: {
        folder_limit: true,
      },
    });

    let isMaxFolders: boolean;

    await Promise.all([folders, limitFolders])
      .then(([folders, limitFolders]) => {
        if (folders >= limitFolders.folder_limit) {
          isMaxFolders = true;
        }
      })
      .catch((error) => {
        handleDBErros(error, this.PATH);
      });

    if (isMaxFolders) {
      throw new ForbiddenException(
        `You have reached the maximum number of folders`,
      );
    }
    return false;
  }
}
