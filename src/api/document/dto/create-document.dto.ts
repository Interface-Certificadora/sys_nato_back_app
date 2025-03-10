import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Id do Usuario',
    example: 1,
    type: Number,
    required: true,
  })
  @IsNumber({}, { message: 'O user_id tem que ser um number' })
  @IsNotEmpty({ message: 'O user_id nao pode ser vazio' })
  clienteId: number;

  @ApiProperty({
    description: 'Tipo de Biometria',
    example: 'Facial',
    type: String,
  })
  @IsOptional()
  tipoDocumento: string;

  @ApiProperty({
    description: 'Numero do Documento',
    example: '123456789',
    type: String,
  })
  @IsOptional()
  numeroDocumento: string;

  @ApiProperty({
    description: 'Validade do Documento',
    example: '01-01-2000',
    type: String,
    required: true,
  })
  @IsOptional()
  validade: Date;
}
