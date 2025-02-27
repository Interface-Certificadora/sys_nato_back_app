import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClienteControllerPublic } from './public/cliente.controller';

@Module({
  controllers: [ClienteController, ClienteControllerPublic],
  providers: [ClienteService, PrismaService],
})
export class ClienteModule {}
