import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorLoginEntity {
  @ApiResponseProperty({
    type: String,
  })
  message: string;
}
