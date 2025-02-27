import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { BiometriaService } from '../biometria.service';
import * as path from 'path';
import * as fs from 'fs';
import { ErrorBiometriaEntity } from '../entities/erro.biometria.entity';
import { UpdateBiometriaDto } from '../dto/update-biometria.dto';
import { Biometria } from '../entities/biometria.entity';

const UPLOADS_FOLDER = path.join('./videos');
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}
@Controller('biometria')
export class BiometriaControllerPublic {
  constructor(private readonly biometriaService: BiometriaService) {}

  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de vídeo MP4',
        },
        metadata: {
          type: 'string',
          description:
            'Metadados do vídeo em formato JSON ex: {"clienteId": 1, "tipoBiometria": "digital"}',
          example: JSON.stringify({ clienteId: 1, tipoBiometria: 'digital' }),
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
    return this.biometriaService.create(file, JSON.parse(data.metadata));
  }

  @Delete('delete/:filename')
  @ApiResponse({
    status: 200,
    description: 'Biometria excluida com sucesso',
    type: Boolean,
  })
  @ApiResponse({
    status: 404,
    description: 'Biometria nao encontrada',
    type: ErrorBiometriaEntity,
  })
  async deleteFile(@Param('filename') filename: string) {
    return await this.biometriaService.deleteFile(filename);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Biometria atualizada com sucesso',
    type: Biometria,
  })
  @ApiResponse({
    status: 404,
    description: 'Biometria nao encontrada',
    type: ErrorBiometriaEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() updateBiometriaDto: UpdateBiometriaDto,
  ) {
    return await this.biometriaService.update(+id, updateBiometriaDto);
  }
}
