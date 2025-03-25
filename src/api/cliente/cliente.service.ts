import { HttpException, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ErrorClienteEntity } from './entities/erro.cliente.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { Cliente } from './entities/cliente.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class ClienteService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
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
      const req = await this.prismaService.cliente.findMany({
        orderBy: { id: 'desc' },
      });
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
    user: any,
  ): Promise<Cliente | ErrorClienteEntity> {
    try {
      const logs = await this.prismaService.cliente.findUnique({
        where: {
          id: id,
        },
        select: {
          logs: true,
        },
      });

      const req = await this.prismaService.cliente.update({
        where: {
          id,
        },
        data: {
          ...updateClienteDto,
          logs: `${logs.logs}\n o Usuario ${user.nome} atualizou as Informaçes do cliente DIA: ${new Date().toLocaleDateString('pt-BR')} HORA: ${new Date().toLocaleTimeString('pt-BR')}, foram alterados os campos: ${JSON.stringify(updateClienteDto)}\n`,
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

  async remove(id: number, user: any): Promise<Cliente | ErrorClienteEntity> {
    try {
      const logs = await this.prismaService.cliente.findUnique({
        where: {
          id: id,
        },
        select: {
          logs: true,
        },
      });

      const req = await this.prismaService.cliente.update({
        where: {
          id,
        },
        data: {
          ativo: false,
          logs: `${logs.logs}\n o Usuario ${user.nome} Desativou o cliente DIA: ${new Date().toLocaleDateString('pt-BR')} HORA: ${new Date().toLocaleTimeString('pt-BR')}\n`,
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

  async link(id: number): Promise<string | ErrorClienteEntity> {
    try {
      const idCrypt = this.jwtService.sign({ id: id.toString() });
      const htmlUrl = `${process.env.HTML_URL}${idCrypt}`;
      const req = await this.prismaService.cliente.update({
        where: {
          id,
        },
        data: {
          linkdownload: htmlUrl,
          statusdownload: 'AGUARDANDO',
        },
      });
      if (!req) {
        const retorno: ErrorClienteEntity = {
          message: 'Nenhum cliente encontrado',
        };
        throw new HttpException(retorno, 404);
      }
      return htmlUrl;
    } catch (error) {
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }

  async downloadStatus(token: string): Promise<string | ErrorClienteEntity> {
    try {
      const id = await this.decryptId(token);
      if (!id) {
        const retorno: ErrorClienteEntity = {
          message: 'Erro Token Invalido',
        };
        throw new HttpException(retorno, 404);
      }
      const req = await this.prismaService.cliente.update({
        where: {
          id: Number(id),
        },
        data: {
          statusdownload: 'ACESSOU LINK',
        },
      });
      if (!req) {
        const retorno: ErrorClienteEntity = {
          message: 'Nenhum cliente encontrado',
        };
        throw new HttpException(retorno, 404);
      }
      return req.statusdownload;
    } catch (error) {
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }

  async decryptId(token: string): Promise<string | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded.id;
    } catch (error) {
      console.error('Token inválido:', error);
      return null;
    }
  }

  async updateEmail(id: number, updateEmailDto: UpdateEmailDto) {
    try {
      const req = await this.prismaService.cliente.update({
        where: {
          id,
        },
        data: {
          email: updateEmailDto.email,
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
  async termos(id: number) {
    try {
      const Existe = await this.prismaService.cliente.findUnique({
        where: {
          id,
        },
      });

      if (!Existe) {
        const retorno: ErrorClienteEntity = {
          message: 'Nenhum cliente encontrado',
        };
        throw new HttpException(retorno, 404);
      }
      await this.prismaService.cliente.update({
        where: {
          id,
        },
        data: {
          termosdeuso: true,
        },
      });
      return new HttpException('Termos Aceitos', 200);
    } catch (error) {
      console.log(error);
      const retorno: ErrorClienteEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }
}
