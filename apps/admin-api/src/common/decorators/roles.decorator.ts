import { SetMetadata } from '@nestjs/common';
import type { UserRoleEnum } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoleEnum[]): ClassDecorator & MethodDecorator =>
  SetMetadata(ROLES_KEY, roles);
