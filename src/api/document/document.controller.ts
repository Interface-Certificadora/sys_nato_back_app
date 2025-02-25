import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ErrorDocumentEntity } from './entities/erro.document.entity';
import { Document } from './entities/document.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import * as fs from 'fs';

const UPLOADS_FOLDER = './documents';
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}
@Controller('document')
export class DocumentController {
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
  @ApiResponse({ status: 201, description: 'Vídeo enviado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao salvar o vídeo' })
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

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
