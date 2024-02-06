import { ForbiddenException, Injectable } from '@nestjs/common';
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

      return await this.folderRepository.save(newFolder);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findManyByUserId(userId: number, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.folderRepository
      .createQueryBuilder('folder')
      .where({ user: { id: userId } })
      .skip(offset)
      .take(limit)
      .orderBy('folder.createdAt', 'DESC')
      .leftJoin('folder.forms', 'form')
      .loadRelationCountAndMap('folder.formCount', 'folder.forms')
      .getMany();
  }

  async findOne(id: string, userId: number) {
    const folder = await this.folderRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
      relations: {
        forms: true,
      },
      select: {
        user: {
          id: true,
        },
      },
    });

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

  async dalete(id: string, userId: number) {
    const folder = await this.findOne(id, userId);
    try {
      await this.folderRepository.remove(folder);
      return { message: `Folder with id ${id} was removed` };
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

    const maxFolders = this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: {
        folder_limit: true,
      },
    });

    await Promise.all([folders, maxFolders])
      .then(([folders, maxFolders]) => {
        if (folders >= maxFolders.folder_limit) {
          throw new ForbiddenException(
            `You have reached the maximum number of folders`,
          );
        }
      })
      .catch((error) => {
        handleDBErros(error, this.PATH);
      });

    return true;
  }
}
