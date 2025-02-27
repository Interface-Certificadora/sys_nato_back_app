import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocumentControllerPublic } from './public/document.controller';

@Module({
  controllers: [DocumentController, DocumentControllerPublic],
  providers: [DocumentService, PrismaService],
})
export class DocumentModule {}
