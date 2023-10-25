import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Type } from './entities/type.entity';
import { SubType } from './entities/sub-types.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(SubType)
    private readonly subTypeRepository: Repository<SubType>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  async findAll() {
    return await this.typeRepository.find({
      relations: {
        subTypes: true,
      },
    });
  }
}
