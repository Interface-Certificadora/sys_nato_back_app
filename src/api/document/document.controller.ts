import { Controller, Get, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ErrorDocumentEntity } from './entities/erro.document.entity';
import * as fs from 'fs';
import { Response } from 'express';
import { Document } from './entities/document.entity';
import { LoginGuard } from '../login/login.guard';

const UPLOADS_FOLDER = './documents';
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}
@UseGuards(LoginGuard)
@ApiBearerAuth()
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('download/:filename')
  @ApiResponse({
    status: 200,
    description: 'Arquivo encontrado para download',
  })
  @ApiResponse({
    status: 404,
    description: 'Arquivo não encontrado',
    type: ErrorDocumentEntity,
  })
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return await this.documentService.downloadFile(filename, res);
  }

  @Get('view/:filename')
  @ApiResponse({
    status: 200,
    description: 'Arquivo encontrado para visualização',
  })
  @ApiResponse({
    status: 404,
    description: 'Arquivo não encontrado',
    type: ErrorDocumentEntity,
  })
  async viewFile(@Param('filename') filename: string, @Res() res: Response) {
    return await this.documentService.viewFile(filename, res);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de biometrias',
    type: [Document],
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum biometria encontrada',
    type: ErrorDocumentEntity,
  })
  async findAll() {
    return await this.documentService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Retorna um documento',
    type: Document,
  })
  @ApiResponse({
    status: 404,
    description: 'Documento nao encontrado',
    type: ErrorDocumentEntity,
  })
  async findOne(@Param('id') id: string) {
    return await this.documentService.findOne(+id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Documento excluido com sucesso',
    type: Document,
  })
  @ApiResponse({
    status: 404,
    description: 'Documento nao encontrado',
    type: ErrorDocumentEntity,
  })
  async remove(@Param('id') id: string) {
    return await this.documentService.remove(+id);
  }
}
