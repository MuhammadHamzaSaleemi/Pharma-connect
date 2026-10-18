import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { NormalizeEmail } from '../../../common/decorators/normalize-email.decorator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'john@pharmaconnect.com' })
  @IsOptional()
  @NormalizeEmail()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  // URL returned by POST /uploads/image, or '' to remove the picture.
  @ApiPropertyOptional({ example: '/uploads/3f2b.png' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(/^(|https?:\/\/\S+|\/(?!\/)\S*)$/, {
    message: 'avatar must be an http(s) URL or a site path',
  })
  avatar?: string;

  @ApiPropertyOptional({ description: 'Required when changing the email address' })
  @IsOptional()
  @IsString()
  currentPassword?: string;
}
