import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from '../../../common/validators/is-equal-to.validator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PASSWORD_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token received via email' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  newPassword!: string;

  @ApiProperty()
  @IsString()
  @IsEqualTo('newPassword', { message: 'confirmNewPassword must match newPassword' })
  confirmNewPassword!: string;
}
