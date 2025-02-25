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
}
