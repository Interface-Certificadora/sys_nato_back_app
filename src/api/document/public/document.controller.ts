import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { DocumentService } from '../document.service';
import { ErrorDocumentEntity } from '../entities/erro.document.entity';
import * as fs from 'fs';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { Document } from '../entities/document.entity';

const UPLOADS_FOLDER = './documents';
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}
@Controller('document')
export class DocumentControllerPublic {
  constructor(private readonly documentService: DocumentService) {}

  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de documento',
        },
        metadata: {
          type: 'string',
          description:
            'Metadados do vídeo em formato JSON ex: {"userId": 1, "tipoDocumento": "CNH" , "numeroDocumento": "123456789" , "validade": "2023-12-31" , "arquivoDocumento": "https://example.com/document.pdf"}',
          example: JSON.stringify({
            userId: 1,
            tipoDocumento: 'CNH',
            numeroDocumento: '123456789',
            validade: '2023-12-31',
            arquivoDocumento: 'https://example.com/document.pdf',
          }),
        },
      },
      required: ['file', 'metadata'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo salvo com sucesso',
    type: Document,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao salvar o Arquivo',
    type: ErrorDocumentEntity,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_FOLDER,
        filename: (req, file, callback) => {
          const uniqueId = randomUUID();
          const originalName = file.originalname.replace(/\s+/g, '_');
          const filename = `${uniqueId}_${originalName}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { metadata: string },
  ) {
    return this.documentService.create(file, JSON.parse(data.metadata));
  }

  @Delete('delete/:filename')
  @ApiResponse({
    status: 200,
    description: 'Documento excluido com sucesso',
    type: Boolean,
  })
  @ApiResponse({
    status: 404,
    description: 'Biometria nao encontrada',
    type: ErrorDocumentEntity,
  })
  async deleteFile(@Param('filename') filename: string) {
    return await this.documentService.deleteFile(filename);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Documento atualizado com sucesso',
    type: Document,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao Atualizar documento',
    type: ErrorDocumentEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return await this.documentService.update(+id, updateDocumentDto);
  }
}
