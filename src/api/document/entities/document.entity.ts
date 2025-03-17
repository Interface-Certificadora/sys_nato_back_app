import { ApiResponseProperty } from '@nestjs/swagger';

export class Document {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: Number })
  userId: number;

  @ApiResponseProperty({ type: String })
  tipodocumento: string;

  @ApiResponseProperty({ type: String })
  numerodocumento: string;

  @ApiResponseProperty({ type: Date })
  validade: Date;

  @ApiResponseProperty({ type: String })
  arquivoDocumento: string;

  @ApiResponseProperty({ type: Date })
  criadoEm: Date;

  @ApiResponseProperty({ type: Date })
  atualizadoEm: Date;

  @ApiResponseProperty({ type: String })
  motivo: string | null;

  constructor(partial: Partial<Document>) {
    Object.assign(this, partial);
  }
}
