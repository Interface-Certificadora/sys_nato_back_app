import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDate,
  Length,
} from 'class-validator';

export class UpdateClienteDto {
  @ApiProperty({
    description: 'Nome do Cliente',
    example: 'Vinicius',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({
    description: 'CPF do Cliente',
    example: '65647746517',
    type: String,
    required: false,
  })
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiProperty({
    description: 'E-mail do Cliente',
    example: 'email@email.com',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Telefone principal',
    example: '13999999999',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({
    description: 'Telefone secundário',
    example: '',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  telefone2?: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '1996-12-16T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  @IsOptional()
  dtNascimento?: Date;

  @ApiProperty({
    description: 'Data da solicitação',
    example: '2025-02-25T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  @IsOptional()
  dtSolicitacao?: Date;

  @ApiProperty({
    description: 'Status ativo',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiProperty({
    description: 'Andamento do Cliente',
    example: 'EMITIDO',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  andamento?: string;

  @ApiProperty({
    description: 'Valor do Certificado',
    example: 85,
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  valorCd?: number;

  @ApiProperty({
    description: 'Alerta Now',
    example: false,
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  alertaNow?: boolean;

  @ApiProperty({
    description: 'Status do Atendimento',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  statusAtendimento?: boolean;

  @ApiProperty({
    description: 'Corretor em formato JSON string',
    example: '{"id":31,"nome":"MARIANA","telefone":"12999999999"}',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  corretor?: string;

  @ApiProperty({
    description: 'Construtora em formato JSON string',
    example: '{"id":5,"fantasia":"MRV"}',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  construtora?: string;

  @ApiProperty({
    description: 'Empreendimento em formato JSON string',
    example:
      '{"id":3,"nome":"Nome Empreendimento","cidade":"Cidade","uf":"SP","tag":"NATO_"}',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  empreendimento?: string;

  @ApiProperty({
    description: 'Financeiro em formato JSON string',
    example: '{"id":12,"fantasia":"R.S."}',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  financeiro?: string;
}
