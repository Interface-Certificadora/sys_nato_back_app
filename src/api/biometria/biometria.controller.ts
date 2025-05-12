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
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BiometriaService } from './biometria.service';
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
import { UpdateBiometriaDto } from './dto/update-biometria.dto';
import { StatusBiometriaEntity } from './entities/status.biometria.entity';
import { S3Service } from 'src/s3/s3.service';

@Controller('biometria')
export class BiometriaController {
  constructor(
    private readonly biometriaService: BiometriaService,
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
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { metadata: string },
  ) {
    if (file) {
      const Ext = file.originalname.split('.').pop();
      const NewName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${Ext}`;

      this.S3.uploadFile('app-biometrias', NewName, file.mimetype, file.buffer);

      return this.biometriaService.create(
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
  @ApiBearerAuth()
  @UseGuards(LoginGuard)
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
    @Req() req,
  ) {
    return await this.biometriaService.update(
      +id,
      updateBiometriaDto,
      req.user,
    );
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
    if (!filename) {
      throw new HttpException('Arquivo não encontrado', HttpStatus.NOT_FOUND);
    }

    const file = await this.S3.downloadFile('app-biometrias', filename);
    const Mine = file.ContentType;
    res.set('Content-Type', Mine || 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(file.buffer);
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
    if (!filename) {
      throw new HttpException('Arquivo não encontrado', HttpStatus.NOT_FOUND);
    }

    const s3file = await this.S3.getFileUrl('app-biometrias', filename);
    return res.redirect(s3file);
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
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.biometriaService.remove(+id, req.user);
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
