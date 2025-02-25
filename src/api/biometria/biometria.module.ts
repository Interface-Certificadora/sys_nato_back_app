import { Module } from '@nestjs/common';
import { BiometriaService } from './biometria.service';
import { BiometriaController } from './biometria.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BiometriaController],
  providers: [BiometriaService, PrismaService],
})
export class BiometriaModule {}
