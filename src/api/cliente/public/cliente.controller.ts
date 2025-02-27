import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ClienteService } from '../cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { Cliente } from '../entities/cliente.entity';
import { ErrorClienteEntity } from '../entities/erro.cliente.entity';
import { UpdateClienteDto } from '../dto/update-cliente.dto';

@Controller('cliente')
export class ClienteControllerPublic {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
    type: Cliente,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao criar o cliente',
    type: ErrorClienteEntity,
  })
  async create(@Body() createClienteDto: CreateClienteDto) {
    return await this.clienteService.create(createClienteDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Atualiza o cliente',
    type: Cliente,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao atualizar o cliente',
    type: ErrorClienteEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return await this.clienteService.update(+id, updateClienteDto);
  }

  @Get('/cpf/:cpf')
  @ApiResponse({
    status: 200,
    description: 'Retorna o cliente pelo cpf',
    type: Cliente,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao retornar o cliente pelo cpf',
    type: ErrorClienteEntity,
  })
  async findOneByCpf(@Param('cpf') cpf: string) {
    return await this.clienteService.findOneByCpf(cpf);
  }
}
