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
import * as mime from 'mime-types';
import { StatusBiometriaEntity } from './entities/status.biometria.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import WhatsApp from '../utils/whatsapp';

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
            status: 'ENVIADO',
            motivo: null,
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
              status: 'ENVIADO',
              motivo: null,
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
              status: 'ENVIADO',
              motivo: null,
            },
          });
          return plainToClass(Biometria, req);
        }
      }
    } catch (error) {
      console.log(error);
      await this.deleteFile(file.filename);
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
    user: any,
  ): Promise<Biometria | ErrorBiometriaEntity> {
    try {
      const biometria = await this.prismaService.biometria.findUnique({
        where: {
          id,
        },
      });

      if (!biometria) {
        const retorno: ErrorBiometriaEntity = {
          message: 'Biometria não encontrada',
        };
        throw new HttpException(retorno, 400);
      }

      const cliente: Cliente = await this.prismaService.cliente.findUnique({
        where: {
          id: biometria.clienteId,
        },
      });

      if (!cliente) {
        throw new HttpException('Cliente nao encontrado', 404);
      }

      const logs = cliente.logs;
      const mensagem = `Olá, ${cliente.nome}! sua coleta Biometrica foi ${updateBiometriaDto.status === 'APROVADO' ? 'APROVADA' : 'REJEITADA'} ${updateBiometriaDto.status === 'REJEITADO' ? ` pelo seguinte motivo: ${updateBiometriaDto.motivo}\n Por Favor faça uma nova coleta no app.` : ', Parabens por ser aprovado!'}`;

      if (updateBiometriaDto.status === 'APROVADO') {
        const verify = await WhatsApp.verify(cliente.telefone);
        if (verify && verify.status === 'VALID_WA_NUMBER') {
          await WhatsApp.sendText(cliente.telefone, mensagem);
        } else {
          console.log(
            `Numero inválido ou não registrado no WhatsApp: ${cliente.telefone}`,
          );
        }
      }

      if (updateBiometriaDto.status === 'REJEITADO') {
        const verify = await WhatsApp.verify(cliente.telefone);
        if (verify && verify.status === 'VALID_WA_NUMBER') {
          await WhatsApp.sendText(cliente.telefone, mensagem);
        } else {
          console.log(
            `Numero inválido ou não registrado no WhatsApp: ${cliente.telefone}`,
          );
        }
      }

      const req = await this.prismaService.biometria.update({
        where: {
          id,
        },
        data: {
          ...updateBiometriaDto,
        },
      });

      await this.prismaService.cliente.update({
        where: {
          id: cliente.id,
        },
        data: {
          logs: `${logs}\n o Usuario ${user.nome} atualizou a biometria DIA: ${new Date().toLocaleDateString('pt-BR')} HORA: ${new Date().toLocaleTimeString('pt-BR')}, foram alterados os campos: ${JSON.stringify(updateBiometriaDto)}\n`,
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

  async remove(id: number, user: any) {
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
      const biometria = await this.prismaService.biometria.findUnique({
        where: {
          id,
        },
      });

      const logs = await this.prismaService.cliente.findUnique({
        where: {
          id: biometria.clienteId,
        },
        select: {
          logs: true,
        },
      });

      await this.prismaService.cliente.update({
        where: {
          id: biometria.clienteId,
        },
        data: {
          logs: `${logs.logs}\n o Usuario ${user.nome} deletou a biometria DIA: ${new Date().toLocaleDateString('pt-BR')} HORA: ${new Date().toLocaleTimeString('pt-BR')}\n`,
        },
      });

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

      // Determina o tipo do arquivo
      const mimeType = mime.lookup(filePath);
      if (!mimeType) {
        throw new Error('Tipo de arquivo não suportado');
      }

      // Define o cabeçalho com o tipo correto
      res.setHeader('Content-Type', mimeType);

      // Envia o arquivo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      const retorno = {
        message: 'Arquivo nao encontrado',
      };
      throw new HttpException(retorno, 400);
    }
  }

  async findOneByClienteId(id: number) {
    try {
      const req = await this.prismaService.biometria.findUnique({
        where: {
          clienteId: id,
        },
      });
      return plainToClass(Biometria, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: 'Erro ao buscar biometria',
      };
      throw new HttpException(retorno, 400);
    }
  }

  async getStatusBiometria(id: number) {
    try {
      const req = await this.prismaService.biometria.findUnique({
        where: {
          clienteId: id,
        },
        select: {
          status: true,
          motivo: true,
        },
      });
      if (!req) {
        throw new HttpException('AGUARDANDO', 200);
      }
      return plainToClass(StatusBiometriaEntity, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorBiometriaEntity = {
        message: 'AGUARDANDO',
      };
      throw new HttpException(retorno, 400);
    }
  }
}
