import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserFolderDto } from './dto/create-user-folder.dto';
import { UserFolder } from './entities/user-folder.entity';
import { handleDBErros } from 'src/common/utils/functions';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserPermissions } from 'src/common/utils/enums';
import { UserFolders } from './interfaces/folders';

@Injectable()
export class UserFolderService {
  private readonly PATH = 'UserFolderService';
  constructor(
    @InjectRepository(UserFolder)
    private userFolderRepository: Repository<UserFolder>,
  ) {}

  async create(createUserFolderDto: CreateUserFolderDto, owner = true) {
    try {
      const newUserFolder = this.userFolderRepository.create({
        user: {
          id: createUserFolderDto.userId,
        },
        folder: {
          id: createUserFolderDto.folderId,
        },
        permissions: createUserFolderDto.permission,
        owner,
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

  async findAllByUserId(userId: number, paginationDto: PaginationDto) {
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
        .getMany();

      const ownerFolders: UserFolders[] = [];
      const sharedFolders: UserFolders[] = [];

      console.log({ folders });

      folders.forEach((info) => {
        if (info.owner) {
          ownerFolders.push({ ...info.folder, owner: info.owner });
        } else {
          sharedFolders.push({ ...info.folder, owner: info.owner });
        }
      });

      return {
        ownerFolders,
        sharedFolders,
      };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  async findOne(folderId: string, userId: number) {
    const folderFound = await this.userFolderRepository
      .createQueryBuilder('userFolder')
      .innerJoinAndSelect('userFolder.user', 'user')
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

    if (!folderFound) throw new NotFoundException('Folder not found');

    if (!folderFound.owner) {
      const owner = await this.userFolderRepository
        .createQueryBuilder('userFolder')
        .innerJoinAndSelect('userFolder.user', 'user')
        .where({ folder: { id: folderId } })
        .andWhere({ owner: true })
        .getOne();

      return {
        ...folderFound.folder,
        owner: folderFound.owner,
        ownerUser: {
          id: owner.user.id,
          name: owner.user.name,
          email: owner.user.email,
          surname: owner.user.surname,
        },
      };
    }

    return { ...folderFound.folder, owner: folderFound.owner };
  }

  async exists(userId: number, folderId: string) {
    const userFolder = await this.userFolderRepository.findOne({
      where: {
        folder: { id: folderId },
        user: { id: userId },
      },
    });

    if (!userFolder) return false;

    return true;
  }

  async hasPermissions(userId: number, folderId: string) {
    const userFolder = await this.userFolderRepository.findOne({
      where: {
        folder: { id: folderId },
        user: { id: userId },
      },
    });

    if (!userFolder) throw new NotFoundException('UserFolder not found');

    const response = {
      isOwner: userFolder.owner,
      canUpdate: userFolder.permissions === UserPermissions.ALL,
    };

    return response;
  }

  remove(id: number) {
    return `This action removes a #${id} userFolder`;
  }
}
