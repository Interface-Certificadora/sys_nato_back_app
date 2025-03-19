import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({
    description: 'E-mail do Cliente',
    example: 'email@email.com',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
