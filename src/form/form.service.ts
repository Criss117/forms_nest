import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      await this.formRepository.save(newForm);
      return {
        statusCode: 201,
        message: 'Form created successfully',
        data: {
          formId: newForm.id,
        },
      };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }

  findAll() {
    return `This action returns all form`;
  }

  async findOne(id: string) {
    const form = await this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect(
        'form.questions',
        'question',
        'question.active = :active',
        {
          active: true,
        },
      )
      .leftJoinAndSelect(
        'question.answers',
        'answer',
        'answer.active = :active',
        {
          active: true,
        },
      )
      .leftJoinAndSelect('question.subtype', 'subtype')
      .where('form.id = :id', { id })
      .getOne();

    return form;
  }

  async remove(id: string, userId: number) {
    const form = await this.formRepository.findOne({
      where: {
        id,
      },
      relations: {
        folder: {
          user: true,
        },
      },
    });

    if (!form) throw new NotFoundException('Form not found');

    if (!form.active) {
      throw new NotFoundException('Form not found');
    }

    if (form.folder.user.id !== userId) {
      throw new UnauthorizedException('Unauthorized user');
    }

    form.active = false;

    try {
      await this.formRepository.save(form);
      return { formId: form.id };
    } catch (error) {
      handleDBErros(error, this.PATH);
    }
  }
}
