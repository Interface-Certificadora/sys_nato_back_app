import { Module } from '@nestjs/common';
import { CondicoesService } from './condicoes.service';
import { CondicoesController } from './condicoes.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CondicoesController],
  providers: [CondicoesService, PrismaService],
})
export class CondicoesModule {}
