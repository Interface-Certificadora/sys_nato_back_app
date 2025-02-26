import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class User {
  @ApiResponseProperty({ type: Number })
  id: number;

  @ApiResponseProperty({ type: String })
  nome: string;

  @ApiResponseProperty({ type: String })
  email: string;

  @ApiResponseProperty({ type: String })
  @Exclude()
  password: string;

  @ApiResponseProperty({ type: String })
  @Exclude()
  senha: string;

  @ApiResponseProperty({ type: Date })
  criadoEm: Date;

  @ApiResponseProperty({ type: Date })
  atualizadoEm: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
