import { ApiResponseProperty } from '@nestjs/swagger';

export class StatusBiometriaEntity {
  @ApiResponseProperty({ type: String })
  statusDocumento: string;

  @ApiResponseProperty({ type: String })
  motivo: string;
}
