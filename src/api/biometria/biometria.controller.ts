import { Controller, Get, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { BiometriaService } from './biometria.service';
import * as path from 'path';
import * as fs from 'fs';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Biometria } from './entities/biometria.entity';
import { ErrorBiometriaEntity } from './entities/erro.biometria.entity';
import { Response } from 'express';
import { LoginGuard } from '../login/login.guard';

const UPLOADS_FOLDER = path.join('./videos');
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

@UseGuards(LoginGuard)
@ApiBearerAuth()
@Controller('biometria')
export class BiometriaController {
  constructor(private readonly biometriaService: BiometriaService) {}

  @Get('download/:filename')
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
}
