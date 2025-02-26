import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './api/user/user.module';
import { BiometriaModule } from './api/biometria/biometria.module';
import { DocumentModule } from './api/document/document.module';
import { ClienteModule } from './api/cliente/cliente.module';

@Module({
  imports: [UserModule, BiometriaModule, DocumentModule, ClienteModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
