import { Controller, Get } from '@nestjs/common';
import { CondicoesService } from './condicoes.service';
import { ApiResponse } from '@nestjs/swagger';
import { Condicoes } from './entities/condicoes.entity';
import { ErrorCondicoesEntity } from './entities/condicoes.error.entity';

@Controller('condicoes')
export class CondicoesController {
  constructor(private readonly condicoesService: CondicoesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna o ultimo Termo e condicoes de uso do sistema',
    type: Condicoes,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao buscar no banco de dados',
    type: ErrorCondicoesEntity,
  })
  async findLast() {
    return await this.condicoesService.findlast();
  }
}
