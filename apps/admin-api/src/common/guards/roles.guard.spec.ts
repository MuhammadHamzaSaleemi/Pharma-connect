import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { RolesGuard } from './roles.guard';

function contextFor(metadata: Record<string, unknown>, user?: { role: UserRoleEnum }) {
  const handler = () => undefined;
  for (const [key, value] of Object.entries(metadata)) Reflect.defineMetadata(key, value, handler);
  return {
    getHandler: () => handler,
    getClass: () => class {},
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  const guard = new RolesGuard(new Reflector());
  const roles = { [ROLES_KEY]: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN] };

  it('lets a listed role through', () => {
    expect(guard.canActivate(contextFor(roles, { role: UserRoleEnum.ADMIN }))).toBe(true);
  });

  it('forbids a role that is not listed', () => {
    expect(() => guard.canActivate(contextFor(roles, { role: UserRoleEnum.EXECUTIVE }))).toThrow(
      ForbiddenException,
    );
  });

  it('forbids a request with no authenticated user', () => {
    expect(() => guard.canActivate(contextFor(roles))).toThrow(ForbiddenException);
  });

  it('skips the role check on @Public() handlers', () => {
    expect(guard.canActivate(contextFor({ ...roles, [IS_PUBLIC_KEY]: true }))).toBe(true);
  });
});
