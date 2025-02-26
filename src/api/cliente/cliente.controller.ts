import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Cliente } from './entities/cliente.entity';
import { ErrorClienteEntity } from './entities/erro.cliente.entity';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

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
  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    return await this.clienteService.create(createClienteDto);
  }

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
