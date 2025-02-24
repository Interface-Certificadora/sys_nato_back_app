import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorUserEntity {
  @ApiResponseProperty({
    type: String,
  })
  message: string;
}
