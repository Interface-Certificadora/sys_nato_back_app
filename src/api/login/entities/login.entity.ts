import { ApiResponseProperty } from '@nestjs/swagger';
import { UserLoginEntity } from './user.login.entity';

export class Login {
  @ApiResponseProperty({ type: String })
  readonly token: string;

  @ApiResponseProperty({ type: UserLoginEntity })
  readonly user: UserLoginEntity;
}
