import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Body,
  Patch,
  Post,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Cliente } from './entities/cliente.entity';
import { ErrorClienteEntity } from './entities/erro.cliente.entity';
import { LoginGuard } from '../login/login.guard';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
@Controller('cliente')
export class ClienteController {
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

  @Get()
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  async findOne(@Param('id') id: string) {
    return await this.clienteService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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

  @Patch('/link/:id')
  // @UseGuards(LoginGuard)
  // @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Cria nova url para cliente baixar o app',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao criar nova url',
    type: ErrorClienteEntity,
  })
  async link(@Param('id') id: string) {
    return await this.clienteService.link(+id);
  }

  @Patch('/downloadstatus/:token')
  @ApiResponse({
    status: 200,
    description: 'Retorna o status do download',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao retornar o status do download',
    type: ErrorClienteEntity,
  })
  async downloadStatus(@Param('token') token: string) {
    return await this.clienteService.downloadStatus(token);
  }
}
