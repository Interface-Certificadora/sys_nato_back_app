import { HttpException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Document } from './entities/document.entity';
import { plainToClass } from 'class-transformer';
import { ErrorDocumentEntity } from './entities/erro.document.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

const UPLOADS_FOLDER = './documents';
@Injectable()
export class DocumentService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(file: Express.Multer.File, metadata: CreateDocumentDto) {
    const id = metadata.userId;
    const baseUrl = process.env.API_ROUTE;
    const validade = new Date(metadata.validade);
    const deleteUrl = `${baseUrl}/document/delete/${file.filename}`;
    const downloadUrl = `${baseUrl}/document/download/${file.filename}`;
    const viewUrl = `${baseUrl}/document/view/${file.filename}`;

    const urls = {
      downloadUrl,
      viewUrl,
      deleteUrl,
    };
    try {
      const Exist = await this.ExistFile(id);

      if (!Exist) {
        const req = await this.prismaService.document.create({
          data: {
            clienteId: id,
            tipoDocumento: metadata.tipoDocumento,
            numeroDocumento: metadata.numeroDocumento,
            validade: validade,
            arquivoDocumento: JSON.stringify(urls),
          },
        });
        return plainToClass(Document, req);
      }

      if (Exist) {
        if (Exist.arquivoDocumento) {
          const urlDelete = JSON.parse(Exist.arquivoDocumento);

          const delFile = await fetch(urlDelete.deleteUrl, {
            method: 'DELETE',
          });
          if (!delFile.ok) {
            throw new Error('Não foi possível deletar o arquivo');
          }
          const req = await this.prismaService.document.update({
            where: {
              id: Exist.id,
            },
            data: {
              clienteId: id,
              tipoDocumento: metadata.tipoDocumento,
              numeroDocumento: metadata.numeroDocumento,
              validade: validade,
              arquivoDocumento: JSON.stringify(urls),
            },
          });
          return plainToClass(Document, req);
        } else {
          const req = await this.prismaService.document.update({
            where: {
              id: Exist.id,
            },
            data: {
              clienteId: id,
              tipoDocumento: metadata.tipoDocumento,
              numeroDocumento: metadata.numeroDocumento,
              validade: validade,
              arquivoDocumento: JSON.stringify(urls),
            },
          });
          return plainToClass(Document, req);
        }
      }
    } catch (error) {
      console.log(error);
      await this.deleteFile(file.filename);
      const retorno: ErrorDocumentEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async downloadFile(filename: string, res: Response) {
    try {
      const filePath = path.join(UPLOADS_FOLDER, filename);

      if (!fs.existsSync(filePath)) {
        throw new Error('Arquivo nao encontrado');
      }

      // res.setHeader(
      //   'Content-Disposition',
      //   `attachment; filename="${filename}"`,
      // );
      // res.setHeader('Content-Type', 'application/octet-stream');

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      const retorno: ErrorDocumentEntity = {
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
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      const retorno: ErrorDocumentEntity = {
        message: 'Arquivo nao encontrado',
      };
      throw new HttpException(retorno, 400);
    }
  }

  async deleteFile(
    filename: string,
  ): Promise<HttpException | ErrorDocumentEntity> {
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
      const retorno: ErrorDocumentEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  ////////////////////////////////////////////////////////

  async findAll(): Promise<Document[] | ErrorDocumentEntity> {
    try {
      const req = await this.prismaService.document.findMany();
      return req.map((i: any) => plainToClass(Document, i));
    } catch (error) {
      const retorno: ErrorDocumentEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async findOne(id: number): Promise<Document | ErrorDocumentEntity> {
    try {
      const req = await this.prismaService.document.findUnique({
        where: {
          id,
        },
      });
      if (!req) {
        throw new HttpException('Documento nao encontrado', 404);
      }
      return plainToClass(Document, req);
    } catch (error) {
      const retorno: ErrorDocumentEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    try {
      const req = await this.prismaService.document.update({
        where: {
          id,
        },
        data: {
          ...updateDocumentDto,
        },
      });

      return plainToClass(Document, req);
    } catch (error) {
      const retorno: ErrorDocumentEntity = {
        message: error.message,
      };
      throw new HttpException(retorno, 400);
    }
  }

  async remove(id: number) {
    try {
      const urls = await this.prismaService.document
        .findUnique({
          where: {
            id,
          },
          select: {
            arquivoDocumento: true,
          },
        })
        .then((res) => JSON.parse(res.arquivoDocumento));

      const delFile = await fetch(urls.deleteUrl, {
        method: 'DELETE',
      });
      if (!delFile.ok) {
        throw new Error('Não foi possível deletar o arquivo');
      }
      const req = await this.prismaService.document.delete({
        where: {
          id,
        },
      });
      if (!req) {
        throw new HttpException('Documento nao encontrado', 404);
      }
      return plainToClass(Document, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorDocumentEntity = {
        message: 'documento não encontrado',
      };
      throw new HttpException(retorno, 404);
    }
  }

  async ExistFile(id: number) {
    try {
      const req = await this.prismaService.document.findMany({
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

  async findOneByClienteId(id: number) {
    try {
      const req = await this.prismaService.document.findUnique({
        where: {
          clienteId: id,
        },
      });
      return plainToClass(Document, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorDocumentEntity = {
        message: 'Erro ao buscar documento',
      };
      throw new HttpException(retorno, 400);
    }
  }
}
