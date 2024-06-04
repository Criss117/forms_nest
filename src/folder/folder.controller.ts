import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import { FolderService } from './folder.service';
import { Auth, GetUser } from '../auth/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateUserFolderDto } from './user-folder/dto/create-user-folder.dto';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  @Auth()
  create(
    @Body() createFolderDto: CreateFolderDto,
    @GetUser('id') userId: number,
  ) {
    return this.folderService.create(createFolderDto, userId);
  }

  @Get()
  @Auth()
  findManyByUserId(
    @GetUser('id') userId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.folderService.findManyByUserId(userId, paginationDto);
  }

  @Get(':id')
  @Auth()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: number,
  ) {
    return this.folderService.findOne(id, userId);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @GetUser('id') userId: number,
  ) {
    return this.folderService.update(id, updateFolderDto, userId);
  }

  @Post('add-members')
  @Auth()
  addMembers(
    @Body() addMembers: CreateUserFolderDto,
    @GetUser('id') userId: number,
  ) {
    return this.folderService.addMembers(addMembers, userId);
  }

  @Delete(':folderId/members/:memberId')
  @Auth()
  removeMember(
    @Param('folderId', ParseUUIDPipe) folderId: string,
    @Param('memberId', ParseIntPipe) memberId: number,
    @GetUser('id') userId: number,
  ) {
    return this.folderService.removeMember(folderId, userId, memberId);
  }
}
