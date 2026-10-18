import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { UserStatusEnum } from '../../common/enums/user-status.enum';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { AuthTransformer } from '../auth/transformers/auth.transformer';
import type { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

// The controller only lets SUPER_ADMIN and ADMIN through, so the service is exercised as one.
const admin: AuthenticatedUser = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@x.com',
  role: UserRoleEnum.SUPER_ADMIN,
  status: UserStatusEnum.ACTIVE,
};

function makeService(target: object | null) {
  const repo = {
    findById: jest.fn().mockResolvedValue(target),
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return {
    repo,
    service: new UsersService(repo as unknown as UsersRepository, new AuthTransformer()),
  };
}

describe('UsersService access rules', () => {
  it('blocks deleting your own account', async () => {
    const { service } = makeService({ id: admin.id, role: 'ADMIN' });
    await expect(service.remove(admin, admin.id)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('blocks changing your own role', async () => {
    const { service } = makeService({
      id: admin.id,
      role: 'ADMIN',
      status: 'ACTIVE',
      email: admin.email,
    });
    await expect(
      service.update(admin, admin.id, { role: UserRoleEnum.EXECUTIVE }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  describe('as an ADMIN', () => {
    const plainAdmin: AuthenticatedUser = { ...admin, id: 'admin-2', role: UserRoleEnum.ADMIN };
    const superAdmin = { id: 's1', role: 'SUPER_ADMIN', status: 'ACTIVE', email: 's@x.com' };

    it('cannot reset a super admin password', async () => {
      const { service, repo } = makeService(superAdmin);
      await expect(
        service.update(plainAdmin, 's1', { password: 'Hijack123!' }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('cannot delete a super admin', async () => {
      const { service, repo } = makeService(superAdmin);
      await expect(service.remove(plainAdmin, 's1')).rejects.toBeInstanceOf(ForbiddenException);
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('cannot create or promote to super admin', async () => {
      const { service } = makeService({ id: 'u1', role: 'EXECUTIVE', status: 'ACTIVE' });
      await expect(
        service.create(plainAdmin, {
          name: 'X',
          email: 'x@x.com',
          password: 'Passw0rd!',
          role: UserRoleEnum.SUPER_ADMIN,
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(
        service.update(plainAdmin, 'u1', { role: UserRoleEnum.SUPER_ADMIN }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  it('revokes sessions when a role changes', async () => {
    const target = {
      id: 'u1',
      role: 'EXECUTIVE',
      status: 'ACTIVE',
      email: 'u@x.com',
      createdAt: new Date(),
    };
    const { service, repo } = makeService(target);
    repo.update.mockResolvedValue({ ...target, role: 'ADMIN' });
    await service.update(admin, 'u1', { role: UserRoleEnum.ADMIN });
    const [, data] = repo.update.mock.calls[0] as [string, Record<string, unknown>];
    expect(data.refreshTokenHash).toBeNull();
    expect(data.tokenValidFrom).toBeInstanceOf(Date);
  });
});
