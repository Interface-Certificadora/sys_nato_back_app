import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorBiometriaEntity {
  @ApiResponseProperty({
    type: String,
  })
  message: string;
}
