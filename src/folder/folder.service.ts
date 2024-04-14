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
import { LEVEL_USER } from '../common/utils/const/level-user';
import { UserFolderService } from './user-folder/user-folder.service';
import { UserPermissions } from 'src/common/utils/enums';

@Injectable()
export class FolderService {
  private readonly PATH = 'FolderService';
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userFolderService: UserFolderService,
  ) {}

  async create(createFolderDto: CreateFolderDto, userId: number) {
    await this.verifyUserFolderLimit(userId);

    try {
      const newFolder = this.folderRepository.create({
        ...createFolderDto,
      });

      await this.folderRepository.save(newFolder);

      await this.userFolderService.create({
        userId,
        folderId: newFolder.id,
        permission: UserPermissions.ALL,
      });

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

  async findManyByUserId(
    userId: number,
    paginationDto: PaginationDto,
    owner: boolean = true,
  ) {
    try {
      const folders = await this.userFolderService.findAllByUserId(
        userId,
        paginationDto,
        owner,
      );

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
    const folder = await this.userFolderService.findOne(id, userId);
    const response = {
      statuscode: 200,
      message: 'Folder retrieved successfully',
      data: folder,
    };

    return response;
  }

  async update(id: string, updateFolderDto: UpdateFolderDto, userId: number) {
    const canUpdate = await this.userFolderService.canUpdate(id, userId);

    if (!canUpdate) {
      throw new ForbiddenException('You can not update this folder');
    }

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

  async delete(id: string) {
    const folder = await this.folderRepository.preload({
      id,
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
        userFolder: {
          user: {
            id: userId,
          },
        },
      },
    });

    const userInfo = this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: {
        level: true,
      },
    });

    let isMaxFolders: boolean;

    await Promise.all([folders, userInfo])
      .then(([folders, userInfo]) => {
        if (folders >= LEVEL_USER[userInfo.level].folderLimit) {
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
