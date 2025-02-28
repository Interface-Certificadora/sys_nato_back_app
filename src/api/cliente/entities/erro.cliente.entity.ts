import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorClienteEntity {
  @ApiResponseProperty({
    type: String,
  })
  message: string;
}
