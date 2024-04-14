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
} from '@nestjs/common';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import { FolderService } from './folder.service';
import { Auth, GetUser } from '../auth/decorators';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FindManyDto } from './dto/find-many.dto';

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
    @Body() findManyDto: FindManyDto,
  ) {
    return this.folderService.findManyByUserId(
      userId,
      paginationDto,
      findManyDto.owner,
    );
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

  // @Delete(':id')
  // @Auth()
  // delete(
  //   @GetUser('id') userId: number,
  //   @Param('id', ParseUUIDPipe) id: string,
  // ) {
  //   return this.folderService.delete(id, userId);
  // }
}
