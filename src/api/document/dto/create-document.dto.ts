import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

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
    required: true,
  })
  @IsNotEmpty({ message: 'O biometria nao pode ser vazio' })
  tipoDocumento: string;

  @ApiProperty({
    description: 'Numero do Documento',
    example: '123456789',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'O Numero do Documento nao pode ser vazio' })
  numeroDocumento: string;

  @ApiProperty({
    description: 'Validade do Documento',
    example: '01-01-2000',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'A validade nao pode ser vazia' })
  validade: Date;
}
