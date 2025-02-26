import { HttpException, Injectable } from '@nestjs/common';
import { CreateBiometriaDto } from './dto/create-biometria.dto';
import { UpdateBiometriaDto } from './dto/update-biometria.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { Biometria } from './entities/biometria.entity';
import { ErrorBiometriaEntity } from './entities/erro.biometria.entity';
import * as path from 'path';
import { Response } from 'express';
import * as fs from 'fs';

const UPLOADS_FOLDER = path.join('./videos');
@Injectable()
export class BiometriaService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(file: Express.Multer.File, metadata: CreateBiometriaDto) {
    const id = metadata.clienteId;
    const baseUrl = process.env.API_ROUTE;

    const deleteUrl = `${baseUrl}/biometria/delete/${file.filename}`;
    const downloadUrl = `${baseUrl}/biometria/download/${file.filename}`;
    const viewUrl = `${baseUrl}/biometria/view/${file.filename}`;

    const urls = {
      downloadUrl,
      viewUrl,
      deleteUrl,
    };
    try {
      const Exist = await this.ExistFile(id);

      if (!Exist) {
        const req = await this.prismaService.biometria.create({
          data: {
            clienteId: id,
            tipoBiometria: metadata.tipoBiometria,
            dadosBiometricos: JSON.stringify(urls),
          },
        });
        return plainToClass(Biometria, req);
      }

      if (Exist) {
        if (Exist.dadosBiometricos) {
          const urlDelete = JSON.parse(Exist.dadosBiometricos);

          const delFile = await fetch(urlDelete.deleteUrl, {
            method: 'DELETE',
          });
          if (!delFile.ok) {
            throw new Error('Não foi possível deletar o arquivo');
          }
          const req = await this.prismaService.biometria.update({
            where: {
              id: Exist.id,
            },
            data: {
              clienteId: id,
              tipoBiometria: metadata.tipoBiometria,
              dadosBiometricos: JSON.stringify(urls),
            },
          });
          return plainToClass(Biometria, req);
        } else {
          const req = await this.prismaService.biometria.update({
            where: {
              id: Exist.id,
            },
            data: {
              clienteId: id,
              tipoBiometria: metadata.tipoBiometria,
              dadosBiometricos: JSON.stringify(urls),
            },
          });
          return plainToClass(Biometria, req);
        }
      }
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async findAll(): Promise<Biometria[] | ErrorBiometriaEntity> {
    try {
      const req = await this.prismaService.biometria.findMany();
      return req.map((i: any) => plainToClass(Biometria, i));
    } catch (error) {
      const retorno: ErrorBiometriaEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async findOne(id: number): Promise<Biometria | ErrorBiometriaEntity> {
    try {
      const req = await this.prismaService.biometria.findUnique({
        where: {
          id,
        },
      });
      return plainToClass(Biometria, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: 'erro ao buscar biometria',
      };
      throw new HttpException(retorno, 400);
    }
  }

  async update(
    id: number,
    updateBiometriaDto: UpdateBiometriaDto,
  ): Promise<Biometria | ErrorBiometriaEntity> {
    try {
      const req = await this.prismaService.biometria.update({
        where: {
          id,
        },
        data: {
          ...updateBiometriaDto,
        },
      });
      return plainToClass(Biometria, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: 'Erro ao atualizar biometria',
      };
      throw new HttpException(retorno, 400);
    }
  }

  async remove(id: number) {
    try {
      const urls = await this.prismaService.biometria
        .findUnique({
          where: {
            id,
          },
          select: {
            dadosBiometricos: true,
          },
        })
        .then((res) => JSON.parse(res.dadosBiometricos));

      const delFile = await fetch(urls.deleteUrl, {
        method: 'DELETE',
      });
      if (!delFile.ok) {
        throw new Error('Não foi possível deletar o arquivo');
      }
      const req = await this.prismaService.biometria.delete({
        where: {
          id,
        },
      });

      return plainToClass(Biometria, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async deleteFile(filename: string) {
    try {
      const filePath = path.join(UPLOADS_FOLDER, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        throw new Error('Arquivo nao encontrado');
      }
      return new HttpException('Arquivo deletado com sucesso', 200);
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async ExistFile(id: number) {
    try {
      const req = await this.prismaService.biometria.findMany({
        where: {
          clienteId: id,
        },
      });
      if (req.length <= 0) {
        return false;
      }
      return req[0];
    } catch (error) {
      return error;
    }
  }

  async downloadFile(filename: string, res: Response) {
    try {
      const filePath = path.join(UPLOADS_FOLDER, filename);

      if (!fs.existsSync(filePath)) {
        throw new Error('Arquivo nao encontrado');
      }

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      res.setHeader('Content-Type', 'application/octet-stream');

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async viewFile(filename: string, res: Response) {
    try {
      const filePath = path.join(UPLOADS_FOLDER, filename);
      if (!fs.existsSync(filePath)) {
        throw new Error('Arquivo nao encontrado');
      }

      res.setHeader('Content-Type', 'video/mp4');
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: 'Arquivo nao encontrado',
      };
      throw new HttpException(retorno, 400);
    }
  }
}
