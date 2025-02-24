import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Nome do Usuario',
    example: 'João da Silva',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString({ message: 'O nome tem que ser uma string' })
  name: string;

  @ApiPropertyOptional({
    description: 'Email para login',
    example: 'email@email.com',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString({ message: 'O email tem que ser uma string' })
  email: string;

  @ApiPropertyOptional({
    description: 'data de nascimento',
    example: '01-01-2000',
    type: String,
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'A data de nascimento deve estar no formato ISO 8601 (YYYY-MM-DD)',
    },
  )
  dataNascimento: string;
}
