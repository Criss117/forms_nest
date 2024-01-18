import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Form } from './entities/form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { FolderService } from '../folder/folder.service';
import { handleDBErros } from '../common/utils/functions';

@Injectable()
export class FormService {
  private readonly PATH = 'FormService';
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    private readonly folderService: FolderService,
  ) {}

  async create(createFormDto: CreateFormDto, userId: number) {
    const { folderId, ...rest } = createFormDto;
    await this.folderService.findOne(folderId, userId);

    const newForm = this.formRepository.create({
      ...rest,
      folder: { id: folderId },
    });

    try {
      return await this.formRepository.save(newForm);
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  findAll() {
    return `This action returns all form`;
  }

  async findOne(id: string, userId: number) {
    const form = await this.formRepository.findOne({
      where: {
        id,
      },
      relations: {
        folder: {
          user: true,
        },
        questions: {
          answers: true,
          subtype: true,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        folder: {
          id: true,
          name: true,
          user: {
            id: true,
          },
        },
        questions: {
          id: true,
          question: true,
          required: true,
          subtype: {
            id: true,
          },
        },
      },
    });

    if (form.folder.user.id !== userId)
      throw new ForbiddenException('Unauthorized user');

    return form;
  }

  async remove(id: string, userId: number) {
    const form = await this.findOne(id, userId);

    try {
      await this.formRepository.remove(form);
      return { message: `Form with id ${id} was removed` };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }
}
