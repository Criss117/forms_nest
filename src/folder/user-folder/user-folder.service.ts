import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserFolderDto } from './dto/create-user-folder.dto';
import { UserFolder } from './entities/user-folder.entity';
import { handleDBErros } from 'src/common/utils/functions';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserPermissions } from 'src/common/utils/enums';

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
  }

  async countFoldersByUser(userId: number) {
    try {
      return await this.userFolderRepository.count({
        where: { user: { id: userId } },
      });
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findAllByUserId(
    userId: number,
    paginationDto: PaginationDto,
    owner = true,
  ) {
    const { limit, offset } = paginationDto;

    try {
      const folders = await this.userFolderRepository
        .createQueryBuilder('userFolder')
        .skip(offset)
        .take(limit)
        .innerJoinAndSelect(
          'userFolder.folder',
          'folder',
          'folder.id = userFolder.folderId',
        )
        .loadRelationCountAndMap(
          'folder.formCount',
          'folder.forms',
          'forms',
          (qb) => qb.where('forms.active = :active', { active: true }),
        )
        .orderBy('folder.createdAt', 'DESC')
        .where({ user: { id: userId } })
        .andWhere({ owner })
        .getMany();

      const data = folders.map((info) => {
        return info.folder;
      });

      return data;
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findOne(folderId: string, userId: number) {
    try {
      const folderFound = await this.userFolderRepository
        .createQueryBuilder('userFolder')
        .innerJoinAndSelect(
          'userFolder.folder',
          'folder',
          'folder.id = userFolder.folderId',
        )
        .leftJoinAndSelect(
          'folder.forms',
          'form',
          'form.active = :active AND form.folderId = folder.id',
          {
            active: true,
          },
        )
        .where({
          folder: { id: folderId },
        })
        .andWhere({ user: { id: userId } })
        .getOne();

      return folderFound.folder;
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async canUpdate(folderId: string, userId: number) {
    const userFolder = await this.userFolderRepository.findOne({
      where: {
        folder: { id: folderId },
        user: { id: userId },
      },
    });

    if (!userFolder) throw new NotFoundException('UserFolder not found');

    const { owner, permissions } = userFolder;

    if (owner) return true;

    if (
      permissions === UserPermissions.ALL ||
      permissions === UserPermissions.WRITE
    ) {
      return true;
    }

    return false;
  }

  remove(id: number) {
    return `This action removes a #${id} userFolder`;
  }
}
