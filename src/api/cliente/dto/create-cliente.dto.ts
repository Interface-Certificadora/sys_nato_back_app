import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDate,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({
    description: 'Nome do Cliente',
    example: 'Gabriel',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome: string;

  @ApiProperty({
    description: 'CPF do Cliente',
    example: '981900000000',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'O CPF não pode ser vazio' })
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  cpf: string;

  @ApiProperty({
    description: 'E-mail do Cliente',
    example: 'email@email.com',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio' })
  email: string;

  @ApiProperty({
    description: 'Telefone principal',
    example: '16992999993',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'O telefone não pode ser vazio' })
  telefone: string;

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
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty({ message: 'A data de solicitação não pode ser vazia' })
  dtSolicitacao: Date;

  @ApiProperty({ description: 'ID FCW', example: 41359, type: Number })
  @IsNumber()
  @IsOptional()
  idFcw: number;

  @ApiProperty({ description: 'Status ativo', example: true, type: Boolean })
  @IsBoolean()
  @IsNotEmpty({ message: 'O status ativo não pode ser vazio' })
  ativo: boolean;

  @ApiProperty({
    description: 'Andamento do Cliente',
    example: 'INICIADO',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'O andamento não pode ser vazio' })
  andamento: string;

  @ApiProperty({
    description: 'Status de pagamento',
    example: 0,
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  statusPgto?: number;

  @ApiProperty({
    description: 'Valor do certificado',
    example: 85,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'O valor do Certificado não pode ser vazio' })
  valorCd: number;

  @ApiProperty({
    description: 'Documento suspenso',
    example: null,
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  docSuspenso?: string;

  @ApiProperty({ description: 'Alerta Now', example: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  alertaNow?: boolean;

  @ApiProperty({
    description: 'Data de criação no Now',
    example: null,
    type: Date,
    required: false,
  })
  @IsDate()
  @IsOptional()
  dtCriacaoNow?: Date;

  @ApiProperty({
    description: 'Status do Atendimento',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsNotEmpty({ message: 'O status de atendimento não pode ser vazio' })
  statusAtendimento: boolean;

  @ApiProperty({
    description: 'Corretor em formato JSON string',
    example: '{"id":999,"nome":"TAUANA","telefone":"15993735661"}',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'O corretor não pode ser vazio' })
  corretor: string;

  @ApiProperty({
    description: 'Construtora em formato JSON string',
    example: '{"id":5,"fantasia":"MRV"}',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'A construtora não pode ser vazia' })
  construtora: string;

  @ApiProperty({
    description: '  endimento em formato JSON string',
    example:
      '{"id":55,"nome":"Nome Empreendimento","cidade":"Cidade","uf":"SP","tag":"NATO_"}',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'O empreendimento não pode ser vazio' })
  empreendimento: string;

  @ApiProperty({
    description: 'Financeiro em formato JSON string',
    example: '{"id":99,"fantasia":"R.S."}',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'O financeiro não pode ser vazio' })
  financeiro: string;
}
