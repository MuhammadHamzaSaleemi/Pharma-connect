import { BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { AuthService } from './auth.service';
import type { AuthRepository } from './repositories/auth.repository';
import { AuthTransformer } from './transformers/auth.transformer';

const PASSWORD = 'OldPass1!';

async function makeService() {
  const user = {
    id: 'u1',
    name: 'Jane',
    email: 'jane@x.com',
    avatar: null,
    password: await bcrypt.hash(PASSWORD, 4),
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date(),
  };
  const repo = {
    findById: jest.fn().mockResolvedValue(user),
    findByEmail: jest.fn().mockResolvedValue(null),
    update: jest.fn((_id: string, data: object) => Promise.resolve({ ...user, ...data })),
    updatePassword: jest.fn(),
    updateRefreshToken: jest.fn(),
  };
  const jwt = { signAsync: jest.fn().mockResolvedValue('token') };
  const config = { getOrThrow: jest.fn().mockReturnValue('secret'), get: jest.fn() };
  const service = new AuthService(
    repo as unknown as AuthRepository,
    new AuthTransformer(),
    jwt as unknown as JwtService,
    config as unknown as ConfigService,
  );
  return { service, repo };
}

describe('AuthService account settings', () => {
  it('updates name and clears the avatar without asking for a password', async () => {
    const { service, repo } = await makeService();
    const result = await service.updateProfile('u1', { name: ' New ', avatar: '' });
    expect(repo.update).toHaveBeenCalledWith('u1', { name: 'New', email: undefined, avatar: null });
    expect(result.name).toBe('New');
  });

  it('requires the current password to change email', async () => {
    const { service, repo } = await makeService();
    await expect(service.updateProfile('u1', { email: 'new@x.com' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      service.updateProfile('u1', { email: 'new@x.com', currentPassword: 'wrong' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repo.update).not.toHaveBeenCalled();

    await service.updateProfile('u1', { email: 'new@x.com', currentPassword: PASSWORD });
    expect(repo.update).toHaveBeenCalledWith('u1', expect.objectContaining({ email: 'new@x.com' }));
  });

  it('rejects an email that belongs to someone else', async () => {
    const { service, repo } = await makeService();
    repo.findByEmail.mockResolvedValue({ id: 'u2' });
    await expect(
      service.updateProfile('u1', { email: 'taken@x.com', currentPassword: PASSWORD }),
    ).rejects.toThrow('Email is already registered');
  });

  it('issues fresh tokens after a password change so the caller stays signed in', async () => {
    const { service, repo } = await makeService();
    const result = await service.changePassword('u1', {
      currentPassword: PASSWORD,
      newPassword: 'NewPass1!',
      confirmNewPassword: 'NewPass1!',
    });
    expect(repo.updatePassword).toHaveBeenCalled();
    expect(repo.updateRefreshToken).toHaveBeenCalledWith('u1', expect.any(String));
    expect(result).toMatchObject({ accessToken: 'token', refreshToken: 'token' });
  });
});

describe('AuthService sign-in flows', () => {
  async function makeFlowService(overrides: Record<string, unknown> = {}) {
    const user = {
      id: 'u1',
      name: 'Jane',
      email: 'jane@x.com',
      avatar: null,
      password: await bcrypt.hash(PASSWORD, 4),
      role: 'ADMIN',
      status: 'ACTIVE',
      refreshTokenHash: createHash('sha256').update('current-refresh').digest('hex'),
      createdAt: new Date(),
      ...overrides,
    };
    const repo = {
      findById: jest.fn().mockResolvedValue(user),
      findByEmail: jest.fn().mockResolvedValue(user),
      findByResetPasswordToken: jest.fn().mockResolvedValue(user),
      updatePassword: jest.fn(),
      updateRefreshToken: jest.fn(),
      setResetPasswordToken: jest.fn(),
      clearResetPasswordToken: jest.fn(),
    };
    const jwt = {
      signAsync: jest.fn().mockResolvedValue('new-token'),
      verify: jest.fn().mockReturnValue({ sub: 'u1', type: 'refresh' }),
    };
    const config = { getOrThrow: jest.fn().mockReturnValue('secret'), get: jest.fn() };
    const service = new AuthService(
      repo as unknown as AuthRepository,
      new AuthTransformer(),
      jwt as unknown as JwtService,
      config as unknown as ConfigService,
    );
    return { service, repo };
  }

  it('rejects a wrong password and an unknown email the same way', async () => {
    const { service, repo } = await makeFlowService();
    await expect(service.login({ email: 'jane@x.com', password: 'nope' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    repo.findByEmail.mockResolvedValue(null);
    await expect(service.login({ email: 'x@x.com', password: PASSWORD })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(repo.updateRefreshToken).not.toHaveBeenCalled();
  });

  it('stores only a hash of the issued refresh token', async () => {
    const { service, repo } = await makeFlowService();
    const result = await service.login({ email: 'jane@x.com', password: PASSWORD });
    expect(result.refreshToken).toBe('new-token');
    const [, stored] = repo.updateRefreshToken.mock.calls[0] as [string, string];
    expect(stored).toBe(createHash('sha256').update('new-token').digest('hex'));
  });

  it('revokes every session when an old refresh token is replayed', async () => {
    const { service, repo } = await makeFlowService();
    await expect(service.refreshToken({ refreshToken: 'already-rotated' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(repo.updateRefreshToken).toHaveBeenCalledWith('u1', null);
  });

  it('never logs the password reset token', async () => {
    const { service, repo } = await makeFlowService();
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    await service.forgotPassword({ email: 'jane@x.com' });
    const [, tokenHash] = repo.setResetPasswordToken.mock.calls[0] as [string, string];
    expect(tokenHash).toMatch(/^[0-9a-f]{64}$/);
    for (const [message] of log.mock.calls) {
      expect(String(message)).not.toMatch(/[0-9a-f]{64}/);
    }
    log.mockRestore();
  });

  it('rejects an expired reset token without changing the password', async () => {
    const { service, repo } = await makeFlowService({
      resetPasswordTokenExpiry: new Date(Date.now() - 1000),
    });
    await expect(
      service.resetPassword({
        token: 't',
        newPassword: 'NewPass1!',
        confirmNewPassword: 'NewPass1!',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repo.updatePassword).not.toHaveBeenCalled();
    expect(repo.clearResetPasswordToken).toHaveBeenCalledWith('u1');
  });
});
