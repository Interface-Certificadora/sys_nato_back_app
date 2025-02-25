import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBiometriaDto {
  @ApiProperty({
    description: 'Id do Usuario',
    example: 1,
    type: Number,
    required: true,
  })
  @IsNumber({}, { message: 'O user_id tem que ser um number' })
  @IsNotEmpty({ message: 'O user_id nao pode ser vazio' })
  userId: number;

  @ApiProperty({
    description: 'Tipo de Biometria',
    example: 'Facial',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'O biometria nao pode ser vazio' })
  tipo_biometria: string;

  @ApiProperty({
    description: 'Dados Biometricos',
    example: 'https://example.com/dados',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString({ message: 'A url tem que ser uma string' })
  @IsNotEmpty({ message: 'A url nao pode ser vazio' })
  dadosBiometric?: string;
}
