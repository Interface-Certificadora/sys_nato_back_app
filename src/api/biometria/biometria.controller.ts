import {
  Controller,
  Get,
  Param,
  Delete,
  Res,
  UseGuards,
  Patch,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BiometriaService } from './biometria.service';
import * as path from 'path';
import * as fs from 'fs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { Biometria } from './entities/biometria.entity';
import { ErrorBiometriaEntity } from './entities/erro.biometria.entity';
import { Response } from 'express';
import { LoginGuard } from '../login/login.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { UpdateBiometriaDto } from './dto/update-biometria.dto';
import { StatusBiometriaEntity } from './entities/status.biometria.entity';

const UPLOADS_FOLDER = path.join('./videos');
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

@Controller('biometria')
export class BiometriaController {
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

  @Get('download/:filename')
  // @ApiBearerAuth()
  // @UseGuards(LoginGuard)
  @ApiResponse({
    status: 200,
    description: 'Arquivo encontrado para download',
  })
  @ApiResponse({
    status: 404,
    description: 'Arquivo não encontrado',
    type: ErrorBiometriaEntity,
  })
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return await this.biometriaService.downloadFile(filename, res);
  }

  @Get('view/:filename')
  // @ApiBearerAuth()
  // @UseGuards(LoginGuard)
  @ApiResponse({
    status: 200,
    description: 'Arquivo encontrado para visualização',
  })
  @ApiResponse({
    status: 404,
    description: 'Arquivo não encontrado',
    type: ErrorBiometriaEntity,
  })
  async viewFile(@Param('filename') filename: string, @Res() res: Response) {
    return await this.biometriaService.viewFile(filename, res);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(LoginGuard)
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de biometrias',
    type: [Biometria],
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum biometria encontrada',
    type: ErrorBiometriaEntity,
  })
  async findAll() {
    return await this.biometriaService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(LoginGuard)
  @ApiResponse({
    status: 200,
    description: 'Retorna uma biometria',
    type: Biometria,
  })
  @ApiResponse({
    status: 404,
    description: 'Biometria nao encontrada',
    type: ErrorBiometriaEntity,
  })
  async findOne(@Param('id') id: string) {
    return await this.biometriaService.findOne(+id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(LoginGuard)
  @ApiResponse({
    status: 200,
    description: 'Biometria excluida com sucesso',
    type: Biometria,
  })
  @ApiResponse({
    status: 404,
    description: 'Biometria nao encontrada',
    type: ErrorBiometriaEntity,
  })
  async remove(@Param('id') id: string) {
    return await this.biometriaService.remove(+id);
  }

  @Get('/cliente/:clienteId')
  @ApiBearerAuth()
  @UseGuards(LoginGuard)
  @ApiResponse({
    status: 200,
    description: 'Retorna uma biometria',
    type: Biometria,
  })
  @ApiResponse({
    status: 404,
    description: 'Biometria nao encontrada',
    type: ErrorBiometriaEntity,
  })
  async findOneByClienteId(@Param('clienteId') id: string) {
    return await this.biometriaService.findOneByClienteId(+id);
  }

  @Get('/statusbio/:id')
  @ApiResponse({
    status: 200,
    description: 'Retorna o status da biometria',
    type: StatusBiometriaEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Biometria nao encontrada',
    type: ErrorBiometriaEntity,
  })
  async getStatusBiometria(@Param('id') id: string) {
    return await this.biometriaService.getStatusBiometria(+id);
  }
}
