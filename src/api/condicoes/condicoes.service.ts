import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorCondicoesEntity } from './entities/condicoes.error.entity';
import { plainToClass } from 'class-transformer';
import { Condicoes } from './entities/condicoes.entity';

@Injectable()
export class CondicoesService {
  constructor(private prismaService: PrismaService) {}
  async findlast() {
    try {
      const condicoes = await this.prismaService.termos_e_condicoes.findFirst({
        orderBy: {
          atualizadoEm: 'desc',
        },
      });

      if (!condicoes) {
        const retorno: ErrorCondicoesEntity = {
          message: 'Nenhuma condicao encontrada',
        };
        throw new HttpException(retorno, 404);
      }
      return plainToClass(Condicoes, condicoes);
    } catch (error) {
      console.log(error);
      const retorno: ErrorCondicoesEntity = {
        message: error.message ? error.message : 'Erro Desconhecido',
      };
      throw new HttpException(retorno, 500);
    }
  }
}
