import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateBiometriaDto {
  @ApiProperty({
    description: 'Tipo de Biometria',
    example: 'Digital',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString({ message: 'O tipo de biometria tem que ser uma string' })
  tipoBiometria: string;

  @ApiProperty({
    description: 'Status da Biometria',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  status: boolean;

  @ApiProperty({
    description: 'Dados Biometricos',
    example: 'https://example.com/dados',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'A url tem que ser uma string' })
  dadosBiometricos?: string;
}
