import { HttpException, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ErrorClienteEntity } from './entities/erro.cliente.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClienteService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    createClienteDto: CreateClienteDto,
  ): Promise<Cliente | ErrorClienteEntity> {
    try {
      const Exist = await this.prismaService.cliente.findFirst({
        where: {
          cpf: createClienteDto.cpf,
        },
      });

      if (Exist) {
        const retorno: ErrorClienteEntity = {
          message: 'CPF ja cadastrado',
        };
        throw new HttpException(retorno, 400);
      }

      const req = await this.prismaService.cliente.create({
        data: createClienteDto,
      });

      return plainToClass(Cliente, req);
    } catch (error) {
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }

  async findAll(): Promise<Cliente[] | ErrorClienteEntity> {
    try {
      const req = await this.prismaService.cliente.findMany();
      if (req.length <= 0) {
        const retorno: ErrorClienteEntity = {
          message: 'Nenhum cliente encontrado',
        };
        throw new HttpException(retorno, 404);
      }
      return req.map((i: any) => plainToClass(Cliente, i));
    } catch (error) {
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }

  async findOne(id: number): Promise<Cliente | ErrorClienteEntity> {
    try {
      const req = await this.prismaService.cliente.findUnique({
        where: {
          id,
        },
      });
      if (!req) {
        const retorno: ErrorClienteEntity = {
          message: 'Nenhum cliente encontrado',
        };
        throw new HttpException(retorno, 404);
      }
      return plainToClass(Cliente, req);
    } catch (error) {
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente | ErrorClienteEntity> {
    try {
      const req = await this.prismaService.cliente.update({
        where: {
          id,
        },
        data: updateClienteDto,
      });

      if (!req) {
        const retorno: ErrorClienteEntity = {
          message: 'Nenhum cliente encontrado',
        };
        throw new HttpException(retorno, 404);
      }

      return plainToClass(Cliente, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }

  async remove(id: number): Promise<Cliente | ErrorClienteEntity> {
    try {
      const req = await this.prismaService.cliente.delete({
        where: {
          id,
        },
      });

      if (!req) {
        const retorno: ErrorClienteEntity = {
          message: 'Nenhum cliente encontrado',
        };
        throw new HttpException(retorno, 404);
      }
      return plainToClass(Cliente, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }

  async findOneByCpf(cpf: string): Promise<Cliente | ErrorClienteEntity> {
    try {
      const req = await this.prismaService.cliente.findFirst({
        where: {
          cpf,
        },
      });
      if (!req) {
        const retorno: ErrorClienteEntity = {
          message: 'Nenhum cliente encontrado',
        };
        throw new HttpException(retorno, 404);
      }
      return plainToClass(Cliente, req);
    } catch (error) {
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }
}
