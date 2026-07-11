import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedUser } from '../strategies/jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  override handleRequest<TUser = AuthenticatedUser>(err: Error | null, user: TUser | false): TUser {
    if (err ?? !user) {
      throw err ?? new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
