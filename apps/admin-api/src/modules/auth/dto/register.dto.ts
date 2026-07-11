import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoleEnum } from '../../../common/enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'john@pharmaconnect.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  })
  password!: string;

  @ApiPropertyOptional({
    enum: UserRoleEnum,
    example: UserRoleEnum.VIEWER,
    description:
      'Self-registration role. Only non-privileged roles are allowed; ADMIN/SUPER_ADMIN cannot be self-assigned. Defaults to VIEWER.',
  })
  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;
}
