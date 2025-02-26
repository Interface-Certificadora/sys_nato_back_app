import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserLoginEntity {
  @ApiResponseProperty({ type: Number })
  readonly id: number;

  @ApiResponseProperty({ type: String })
  readonly nome: string;

  @ApiResponseProperty({ type: String })
  @Expose()
  readonly email: string;
}
