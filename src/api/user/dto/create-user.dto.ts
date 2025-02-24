import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do Usuario',
    example: 'João da Silva',
    type: String,
    required: true,
  })
  @IsString({ message: 'O nome tem que ser uma string' })
  @IsNotEmpty({ message: 'O nome nao pode ser vazio' })
  nome: string;

  @ApiProperty({
    description: 'Email para login',
    example: 'email@email.com',
    type: String,
    required: true,
  })
  @IsString({ message: 'O email tem que ser uma string' })
  @IsNotEmpty({ message: 'O email não pode ser vazio' })
  email: string;

  @ApiProperty({
    description: 'senha para o Login',
    example: '1234569',
    type: String,
    required: true,
  })
  @IsString({ message: 'A senha tem que ser uma string' })
  @IsNotEmpty({ message: 'A senha não pode ser vazio' })
  password: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '2000-01-01',
    type: String,
    required: true,
  })
  @IsDateString(
    {},
    {
      message:
        'A data de nascimento deve estar no formato ISO 8601 (YYYY-MM-DD)',
    },
  )
  @IsNotEmpty({ message: 'A data de nascimento não pode ser vazia' })
  data_nascimento: string;
}
