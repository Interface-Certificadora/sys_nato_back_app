import { ApiResponseProperty } from '@nestjs/swagger';

export class StatusDocumentEntity {
  @ApiResponseProperty({
    type: String,
  })
  statusDocumento: string;
}
