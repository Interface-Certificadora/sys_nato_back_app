import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './api/user/user.module';
import { BiometriaModule } from './api/biometria/biometria.module';

@Module({
  imports: [UserModule, BiometriaModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
