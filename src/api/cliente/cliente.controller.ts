import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Cliente } from './entities/cliente.entity';
import { ErrorClienteEntity } from './entities/erro.cliente.entity';
import { LoginGuard } from '../login/login.guard';

@UseGuards(LoginGuard)
@ApiBearerAuth()
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os clientes',
    type: [Cliente],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao retornar os clientes',
    type: ErrorClienteEntity,
  })
  async findAll() {
    return await this.clienteService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Retorna um cliente',
    type: Cliente,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao retornar o cliente',
    type: ErrorClienteEntity,
  })
  findOne(@Param('id') id: string) {
    return this.clienteService.findOne(+id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Deleta o cliente',
    type: Cliente,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao deletar o cliente',
    type: ErrorClienteEntity,
  })
  remove(@Param('id') id: string) {
    return this.clienteService.remove(+id);
  }
}
