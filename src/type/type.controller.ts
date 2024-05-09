import { Controller, Get } from '@nestjs/common';
import { TypeService } from './type.service';
import { Auth } from '../auth/decorators';

@Controller('types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Get()
  @Auth()
  findAll() {
    return this.typeService.findAll();
  }
}
