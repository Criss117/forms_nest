import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Type } from '../type/entities/type.entity';
import {
  SeedSubTypes,
  SeedTypes,
  initialSubTypes,
  initialTypes,
} from './data/seed-data';
import { SubType } from '../type/entities/sub-types.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    @InjectRepository(SubType)
    private readonly subTypeRepository: Repository<SubType>,
    private readonly configServices: ConfigService,
  ) {}

  async executeSeed() {
    if (!this.configServices.get('EXECUTE_SEED')) {
      throw new UnauthorizedException('Seed is not available');
    }

    await this.deleteTypes();
    this.insertTypes();
    this.logger.log('Seed executed successfully', 'SeedRepository');
    return 'Seed Executed';
  }

  private async deleteTypes() {
    const deleteSubTypes =
      this.subTypeRepository.createQueryBuilder('subtypes');
    await deleteSubTypes.delete().where({}).execute();

    const deleteType = this.typeRepository.createQueryBuilder('types');
    await deleteType.delete().where({}).execute();
  }

  private async insertTypes() {
    const insertPromises: Promise<SeedTypes | SeedSubTypes>[] = [];

    initialTypes.forEach((type) => {
      insertPromises.push(this.typeRepository.save(type));
    });
    await Promise.all(insertPromises);

    initialSubTypes.forEach((subType) => {
      insertPromises.push(this.subTypeRepository.save(subType));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
