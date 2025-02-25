import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorDocumentEntity {
  @ApiResponseProperty({
    type: String,
  })
  message: string;
}
