import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { Auth, GetUser } from '../auth/decorators';
import { GetPermissions } from 'src/folder/decorators/get-permisions.decorator';
import { HasPermissions } from 'src/folder/user-folder/interfaces/has-permisions';

@Controller('folder/:folderId/form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post('')
  @Auth()
  create(@Body() createFormDto: CreateFormDto, @GetUser('id') userId: number) {
    return this.formService.create(createFormDto, userId);
  }

  @Get('/:formId')
  @Auth()
  @GetPermissions()
  findOne(
    @GetUser('id') userId: number,
    @Param('folderId') folderId: string,
    @Param('formId') formId: string,
    permissions: HasPermissions,
  ) {
    return this.formService.findOne(formId, permissions);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.formService.remove(id, userId);
  }
}
