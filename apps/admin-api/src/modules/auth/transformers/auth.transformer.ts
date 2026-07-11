import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { BaseTransformer } from '../../../common/transformers/base.transformer';
import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { UserStatusEnum } from '../../../common/enums/user-status.enum';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { CurrentUserDto } from '../dto/current-user.dto';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthTransformer extends BaseTransformer<User, CurrentUserDto> {
  transform(user: User): CurrentUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as unknown as UserRoleEnum,
      status: user.status as unknown as UserStatusEnum,
      createdAt: user.createdAt,
    };
  }

  toAuthResponse(user: User, tokens: TokenPair): AuthResponseDto {
    const profile = this.transform(user);
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      status: profile.status,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
