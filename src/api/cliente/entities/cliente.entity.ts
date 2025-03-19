import { ApiResponseProperty } from '@nestjs/swagger';

export class Cliente {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  nome: string;

  @ApiResponseProperty({ type: String })
  cpf: string;

  @ApiResponseProperty({ type: String })
  email: string;

  @ApiResponseProperty({ type: String })
  telefone: string;

  @ApiResponseProperty({ type: String })
  telefone2?: string;

  @ApiResponseProperty({ type: Date })
  dtNascimento?: Date;

  @ApiResponseProperty({ type: Date })
  dtSolicitacao: Date;

  @ApiResponseProperty({ type: Number })
  idFcw: number;

  @ApiResponseProperty({ type: Boolean })
  ativo: boolean;

  @ApiResponseProperty({ type: String })
  andamento: string;

  @ApiResponseProperty({ type: String })
  statusPgto?: string;

  @ApiResponseProperty({ type: Number })
  valorCd: number;

  @ApiResponseProperty({ type: String })
  docSuspenso?: string;

  @ApiResponseProperty({ type: Boolean })
  alertaNow: boolean;

  @ApiResponseProperty({ type: Date })
  dtCriacaoNow?: Date;

  @ApiResponseProperty({ type: Boolean })
  statusAtendimento: boolean;

  @ApiResponseProperty({ type: String })
  corretor: string; // JSON stringified

  @ApiResponseProperty({ type: String })
  construtora: string; // JSON stringified

  @ApiResponseProperty({ type: String })
  empreendimento: string; // JSON stringified

  @ApiResponseProperty({ type: String })
  financeiro: string; // JSON stringified

  @ApiResponseProperty({ type: String })
  linkdownload: string;

  @ApiResponseProperty({ type: String })
  statusdownload: string;

  @ApiResponseProperty({ type: String })
  logs: string;

  constructor(partial: Partial<Cliente>) {
    Object.assign(this, partial);
  }
}
