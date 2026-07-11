import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@pharmaconnect.com' })
  @IsEmail()
  email!: string;
}
