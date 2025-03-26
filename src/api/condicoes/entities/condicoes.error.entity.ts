import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorCondicoesEntity {
  @ApiResponseProperty({
    type: String,
  })
  message: string;
}
