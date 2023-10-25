import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubQuestionService } from './sub-question.service';
import { CreateSubQuestionDto } from './dto/create-sub-question.dto';
import { UpdateSubQuestionDto } from './dto/update-sub-question.dto';

@Controller('sub-question')
export class SubQuestionController {
  constructor(private readonly subQuestionService: SubQuestionService) {}

  @Post()
  create(@Body() createSubQuestionDto: CreateSubQuestionDto) {
    return this.subQuestionService.create(createSubQuestionDto);
  }

  @Get()
  findAll() {
    return this.subQuestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subQuestionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubQuestionDto: UpdateSubQuestionDto) {
    return this.subQuestionService.update(+id, updateSubQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subQuestionService.remove(+id);
  }
}
