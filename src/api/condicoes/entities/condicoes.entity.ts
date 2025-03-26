import { ApiResponseProperty } from '@nestjs/swagger';

export class Condicoes {
  @ApiResponseProperty({ type: String })
  termos: string;

  constructor(partial: Partial<Condicoes>) {
    Object.assign(this, partial);
  }
}
