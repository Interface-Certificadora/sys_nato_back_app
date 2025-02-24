import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorUserEntity } from './entities/erro.user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async create(dados: CreateUserDto): Promise<User | ErrorUserEntity> {
    try {
      if (!dados || !dados.email || !dados.password || !dados.nome) {
        const retorno: ErrorUserEntity = {
          message: 'Dados de entrada inválidos',
        };
        throw new HttpException(retorno, 400);
      }

      const UsuarioExist = await this.prismaService.user.findFirst({
        where: {
          email: dados.email,
        },
      });

      if (UsuarioExist) {
        const retorno: ErrorUserEntity = {
          message: 'Email já cadastrado',
        };
        throw new HttpException(retorno, 400);
      }

      const hashedPassword = this.generateHash(dados.password);

      const req = await Promise.resolve(
        await this.prismaService.user.create({
          data: {
            nome: dados.nome.toUpperCase(),
            email: dados.email,
            senha: dados.password,
            password: hashedPassword,
          },
        }),
      );

      if (!req) {
        const retorno: ErrorUserEntity = {
          message: 'Falha ao criar o usuário',
        };
        throw new HttpException(retorno, 500);
      }

      return plainToClass(User, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorUserEntity = {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }

  async findAll(): Promise<User[] | ErrorUserEntity> {
    try {
      const req = await this.prismaService.user.findMany();

      return req.map((i: any) => plainToClass(User, i));
    } catch (error) {
      const retorno: ErrorUserEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async findOne(id: number): Promise<User | ErrorUserEntity> {
    try {
      const req = await this.prismaService.user.findUnique({
        where: {
          id: id,
        },
      });
      return plainToClass(User, req);
    } catch (error) {
      const retorno: ErrorUserEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async update(
    id: number,
    dados: UpdateUserDto,
  ): Promise<User | ErrorUserEntity> {
    try {
      await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          nome: dados.name.toUpperCase(),
          email: dados.email,
          dataNascimento: dados.dataNascimento,
        },
      });

      const req = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      return plainToClass(User, req);
    } catch (error) {
      const retorno: ErrorUserEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async remove(id: number): Promise<User | ErrorUserEntity> {
    try {
      await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      const req = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      return plainToClass(User, req);
    } catch (error) {
      const retorno: ErrorUserEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  //

  generateHash(password: string) {
    return bcrypt.hashSync(password, 10);
  }
}
