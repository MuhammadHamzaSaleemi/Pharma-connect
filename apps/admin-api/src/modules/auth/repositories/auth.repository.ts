import { Injectable } from '@nestjs/common';
import { Prisma, type User } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByResetPasswordToken(tokenHash: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { resetPasswordToken: tokenHash } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateRefreshToken(userId: string, refreshTokenHash: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async invalidateTokens(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null, tokenValidFrom: new Date() },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, refreshTokenHash: null, tokenValidFrom: new Date() },
    });
  }

  async setResetPasswordToken(userId: string, tokenHash: string, expiry: Date): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: tokenHash,
        resetPasswordTokenExpiry: expiry,
      },
    });
  }

  async clearResetPasswordToken(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
        refreshTokenHash: null,
      },
    });
  }
}
