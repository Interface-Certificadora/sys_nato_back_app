import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectVersionsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'node:stream';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.MINIO_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      },
      endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000', // MinIO ou AWS
      forcePathStyle: true, // Necessário para MinIO
    });
  }

  async uploadFile(
    bucketName: string,
    fileName: string,
    fileTipe: string,
    fileBuffer: Buffer,
  ) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: fileTipe,
    });

    return await this.s3Client.send(command);
  }

  async getFileUrl(bucketName: string, fileName: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return url.split('?')[0];
    } catch (error) {
      console.log('🚀 ~ S3Service ~ getFileUrl ~ error:', error);
      throw new HttpException('Arquivo nao encontrado', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(bucketName: string, fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    return await this.s3Client.send(command);
  }

  async deleteAllFiles(bucketName: string, fileName: string) {
    const listVersionFiles = new ListObjectVersionsCommand({
      Bucket: bucketName,
      Prefix: fileName,
    });

    const { Versions } = await this.s3Client.send(listVersionFiles);

    if (!Versions || Versions.length === 0) {
      console.log('Nenhuma versão encontrada para o arquivo:', fileName);
      return;
    }

    const List = [];

    for (const version of Versions) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        VersionId: version.VersionId,
      });

      const result = await this.s3Client.send(deleteCommand);
      List.push(result);
    }
  }

  async downloadFile(bucketName: string, fileName: string) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const result = await this.s3Client.send(command);
    return {
      buffer: await this.streamToBuffer(result.Body as Readable),
      ContentType: result.ContentType,
    };
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
