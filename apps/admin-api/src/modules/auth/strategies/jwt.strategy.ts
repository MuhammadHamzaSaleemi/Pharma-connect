import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserStatus } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenTypeEnum } from '../../../common/enums/token-type.enum';
import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { UserStatusEnum } from '../../../common/enums/user-status.enum';
import { AuthRepository } from '../repositories/auth.repository';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRoleEnum;
  type: TokenTypeEnum;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
  status: UserStatusEnum;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (payload.type !== TokenTypeEnum.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.authRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const tokenValidFromSeconds = Math.floor(user.tokenValidFrom.getTime() / 1000);
    if (payload.iat !== undefined && payload.iat < tokenValidFromSeconds) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as unknown as UserRoleEnum,
      status: user.status as unknown as UserStatusEnum,
    };
  }
}
