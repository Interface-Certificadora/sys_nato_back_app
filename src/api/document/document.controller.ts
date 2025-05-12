import {
  Controller,
  Get,
  Param,
  Delete,
  Res,
  UseGuards,
  Body,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorDocumentEntity } from './entities/erro.document.entity';
import * as fs from 'fs';
import { Response } from 'express';
import { Document } from './entities/document.entity';
import { LoginGuard } from '../login/login.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { StatusDocumentEntity } from './entities/status.document.entity';
import { S3Service } from 'src/s3/s3.service';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private S3: S3Service,
  ) {}

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
            'Metadados do vídeo em formato JSON ex: {"clienteId": 1, "tipoDocumento": "CNH" , "numeroDocumento": "123456789" , "validade": "2023-12-31" , "arquivoDocumento": "https://example.com/document.pdf"}',
          example: JSON.stringify({
            clienteId: 1,
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
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { metadata: string },
  ) {
    if (file) {
      const Ext = file.originalname.split('.').pop();
      const NewName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${Ext}`;

      this.S3.uploadFile('app-documents', NewName, file.mimetype, file.buffer);

      return this.documentService.create(
        file,
        JSON.parse(data.metadata),
        NewName,
      );
    } else {
      return new HttpException('Arquivo nao encontrado', 404);
    }
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
  @ApiBearerAuth()
  @UseGuards(LoginGuard)
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
    @Req() req: any,
  ) {
    return await this.documentService.update(+id, updateDocumentDto, req.user);
  }

  @Get('download/:filename')
  // @UseGuards(LoginGuard)
  // @ApiBearerAuth()
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
    @Res() resp: Response,
  ) {
    if (!filename) {
      throw new HttpException('Arquivo não encontrado', HttpStatus.NOT_FOUND);
    }

    const file = await this.S3.downloadFile('app-documents', filename);
    const Mine = file.ContentType;
    resp.set('Content-Type', Mine || 'application/octet-stream');
    resp.set('Content-Disposition', `attachment; filename="${filename}"`);
    resp.send(file.buffer);
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
    if (!filename) {
      throw new HttpException('Arquivo não encontrado', HttpStatus.NOT_FOUND);
    }

    const s3file = await this.S3.getFileUrl('app-documents', filename);
    return res.redirect(s3file);
  }

  @Get()
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.documentService.remove(+id, req.user);
  }

  @Get('cliente/:clienteId')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
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
  async findOneByClienteId(@Param('clienteId') id: string) {
    return await this.documentService.findOneByClienteId(+id);
  }

  @Get('/statusdoc/:id')
  @ApiResponse({
    status: 200,
    description: 'Retorna o status do documento',
    type: StatusDocumentEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Documento nao encontrado',
    type: ErrorDocumentEntity,
  })
  async statusDoc(@Param('id') id: string) {
    return await this.documentService.statusDoc(+id);
  }
}
