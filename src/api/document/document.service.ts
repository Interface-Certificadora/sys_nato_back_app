import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Document } from './entities/document.entity';
import { plainToClass } from 'class-transformer';
import { ErrorDocumentEntity } from './entities/erro.document.entity';
import { StatusDocumentEntity } from './entities/status.document.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { S3Service } from 'src/s3/s3.service';

const UPLOADS_FOLDER = './documents';
@Injectable()
export class DocumentService {
  constructor(
    private readonly prismaService: PrismaService,
    private S3: S3Service,
  ) {}
  async create(
    file: Express.Multer.File,
    metadata: CreateDocumentDto,
    NewName?: string,
  ) {
    const id = metadata.clienteId;
    const baseUrl = process.env.API_ROUTE;
    const validade = metadata.validade ? new Date(metadata.validade) : null;
    const tipoDocumento = metadata.tipoDocumento
      ? metadata.tipoDocumento
      : null;
    console.log(tipoDocumento);
    const deleteUrl = `${baseUrl}/document/delete/${NewName}`;
    const downloadUrl = `${baseUrl}/document/download/${NewName}`;
    const viewUrl = `${baseUrl}/document/view/${NewName}`;

    const urls = {
      downloadUrl,
      viewUrl,
      deleteUrl,
    };

    try {
      const Exist = await this.ExistFile(id);
      console.log(Exist);

      if (!Exist) {
        const req = await this.prismaService.document.create({
          data: {
            clienteId: id,
            ...(tipoDocumento
              ? {
                  tipoDocumento: tipoDocumento,
                }
              : ''),
            ...(metadata.numeroDocumento && {
              numeroDocumento: metadata.numeroDocumento,
            }),
            ...(validade && { validade: validade }),
            arquivoDocumento: JSON.stringify(urls),
            status: 'ENVIADO',
            motivo: null,
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
              ...(metadata.tipoDocumento && {
                tipoDocumento: metadata.tipoDocumento,
              }),
              ...(metadata.numeroDocumento && {
                numeroDocumento: metadata.numeroDocumento,
              }),
              ...(validade && { validade: validade }),
              arquivoDocumento: JSON.stringify(urls),
              status: 'ENVIADO',
              motivo: null,
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
              ...(metadata.tipoDocumento && {
                tipoDocumento: metadata.tipoDocumento,
              }),
              ...(metadata.numeroDocumento && {
                numeroDocumento: metadata.numeroDocumento,
              }),
              ...(validade && { validade: validade }),
              arquivoDocumento: JSON.stringify(urls),
              status: 'ENVIADO',
              motivo: null,
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

  async deleteFile(
    filename: string,
  ): Promise<HttpException | ErrorDocumentEntity> {
    try {
      if (!filename) {
        throw new HttpException('Arquivo não encontrado', HttpStatus.NOT_FOUND);
      }
      await this.S3.deleteAllFiles('app-documents', filename);
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

  async update(id: number, updateDocumentDto: UpdateDocumentDto, user: any) {
    try {
      const documento = await this.prismaService.document.findUnique({
        where: {
          id,
        },
      });

      if (!documento) {
        throw new HttpException('Documento nao encontrado', 404);
      }

      const cliente: Cliente = await this.prismaService.cliente.findUnique({
        where: {
          id: documento.clienteId,
        },
      });

      if (!cliente) {
        throw new HttpException('Cliente nao encontrado', 404);
      }

      const logs = cliente.logs;

      // const mensagem = `Olá, ${cliente.nome}! seu Documento foi ${updateDocumentDto.status} ${updateDocumentDto.status === 'REJEITADO' ? ` pelo seguinte motivo: ${updateDocumentDto.motivo}.\n Por Favor Mande uma nova imagem no app.` : ', Parabens por ser aprovado!'}`;
      // if (updateDocumentDto.status === 'APROVADO') {
      //   const verify = await WhatsApp.verify(cliente.telefone);
      //   if (verify && verify.status === 'VALID_WA_NUMBER') {
      //     await WhatsApp.sendText(cliente.telefone, mensagem);
      //   } else {
      //     console.log(
      //       `Número inválido ou não registrado no WhatsApp: ${cliente.telefone}`,
      //     );
      //   }
      // }
      // if (updateDocumentDto.status === 'REJEITADO') {
      //   const verify = await WhatsApp.verify(cliente.telefone);
      //   if (verify && verify.status === 'VALID_WA_NUMBER') {
      //     await WhatsApp.sendText(cliente.telefone, mensagem);
      //   }
      // }

      await this.prismaService.cliente.update({
        where: {
          id: cliente.id,
        },
        data: {
          logs: `${logs}\n o Usuario ${user.nome} atualizou o documento DIA: ${new Date().toLocaleDateString('pt-BR')} HORA: ${new Date().toLocaleTimeString('pt-BR')}, foram alterados os campos: ${JSON.stringify(updateDocumentDto)}\n`,
        },
      });

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

  async remove(id: number, user: any) {
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
      const documento = await this.prismaService.document.findUnique({
        where: {
          id,
        },
      });

      const logs = await this.prismaService.cliente.findUnique({
        where: {
          id: documento.clienteId,
        },
        select: {
          logs: true,
        },
      });

      await this.prismaService.cliente.update({
        where: {
          id: documento.clienteId,
        },
        data: {
          logs: `${logs.logs}\n o Usuario ${user.nome} deletou o documento DIA: ${new Date().toLocaleDateString('pt-BR')} HORA: ${new Date().toLocaleTimeString('pt-BR')}\n`,
        },
      });

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

  async statusDoc(id: number) {
    try {
      const req = await this.prismaService.document.findUnique({
        where: {
          clienteId: id,
        },
        select: {
          status: true,
          motivo: true,
        },
      });
      if (!req) {
        const retorno = {
          status: 'AGUARDANDO',
          motivo: null,
        };
        return plainToClass(StatusDocumentEntity, retorno);
      }

      return plainToClass(StatusDocumentEntity, req);
    } catch (error) {
      console.log(error);
      const retorno: ErrorDocumentEntity = {
        message: 'Erro ao buscar documento',
      };
      throw new HttpException(retorno, 400);
    }
  }
}
