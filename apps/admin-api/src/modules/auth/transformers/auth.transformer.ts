import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { BaseTransformer } from '../../../common/transformers/base.transformer';
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
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  toAuthResponse(user: User, tokens: TokenPair): AuthResponseDto {
    return { ...this.transform(user), ...tokens };
  }
}
