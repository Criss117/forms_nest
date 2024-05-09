import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Type } from './entities/type.entity';
import { SubType } from './entities/sub-types.entity';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(SubType)
    private readonly subTypeRepository: Repository<SubType>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  async findAll() {
    const types = await this.typeRepository.find({
      relations: {
        subTypes: true,
      },
    });

    return {
      statusCode: 200,
      message: 'Types retrieved successfully',
      data: types,
    };
  }
}
