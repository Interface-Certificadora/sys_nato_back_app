import { Module } from '@nestjs/common';
import { BiometriaService } from './biometria.service';
import { BiometriaController } from './biometria.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BiometriaControllerPublic } from './public/biometria.controller';

@Module({
  controllers: [BiometriaController, BiometriaControllerPublic],
  providers: [BiometriaService, PrismaService],
})
export class BiometriaModule {}
