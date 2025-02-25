import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './api/user/user.module';
import { BiometriaModule } from './api/biometria/biometria.module';
import { DocumentModule } from './api/document/document.module';

@Module({
  imports: [UserModule, BiometriaModule, DocumentModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
