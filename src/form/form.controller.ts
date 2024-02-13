import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { Auth, GetUser } from '../auth/decorators';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @Auth()
  create(@Body() createFormDto: CreateFormDto, @GetUser('id') userId: number) {
    return this.formService.create(createFormDto, userId);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.formService.findOne(id);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.formService.remove(id, userId);
  }
}
