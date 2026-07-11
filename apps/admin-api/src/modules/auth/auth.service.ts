import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import { TokenTypeEnum } from '../../common/enums/token-type.enum';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { AuthRepository } from './repositories/auth.repository';
import { AuthTransformer } from './transformers/auth.transformer';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CurrentUserDto } from './dto/current-user.dto';
import type { JwtPayload } from './strategies/jwt.strategy';

const BCRYPT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

const SELF_REGISTERABLE_ROLES: readonly UserRoleEnum[] = [
  UserRoleEnum.ADMIN,
  UserRoleEnum.PHARMACIST,
  UserRoleEnum.MANAGER,
  UserRoleEnum.VIEWER,
];
const DEFAULT_REGISTER_ROLE = UserRoleEnum.VIEWER;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authTransformer: AuthTransformer,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email is already registered');
    }

    const role = this.resolveRegistrationRole(dto.role);

    const hashedPassword = await this.hashPassword(dto.password);
    const user = await this.authRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role,
    });

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role as unknown as UserRoleEnum,
    );
    await this.authRepository.updateRefreshToken(user.id, this.hashToken(tokens.refreshToken));

    this.logger.log(`New user registered: ${user.email}`);
    return this.authTransformer.toAuthResponse(user, tokens);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await this.verifyPassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role as unknown as UserRoleEnum,
    );
    await this.authRepository.updateRefreshToken(user.id, this.hashToken(tokens.refreshToken));

    this.logger.log(`User logged in: ${user.email}`);
    return this.authTransformer.toAuthResponse(user, tokens);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== TokenTypeEnum.REFRESH) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.authRepository.findById(payload.sub);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const incomingHash = this.hashToken(dto.refreshToken);
    if (incomingHash !== user.refreshTokenHash) {
      // Token reuse detected — revoke all sessions as a security measure
      await this.authRepository.updateRefreshToken(user.id, null);
      throw new UnauthorizedException('Refresh token reuse detected — all sessions revoked');
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role as unknown as UserRoleEnum,
    );
    await this.authRepository.updateRefreshToken(user.id, this.hashToken(tokens.refreshToken));

    return this.authTransformer.toAuthResponse(user, tokens);
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.invalidateTokens(userId);
    this.logger.log(`User logged out: ${userId}`);
  }

  async getMe(userId: string): Promise<CurrentUserDto> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }
    return this.authTransformer.transform(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    const isCurrentValid = await this.verifyPassword(dto.currentPassword, user.password);
    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const isSamePassword = await this.verifyPassword(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from the current password');
    }

    const hashedPassword = await this.hashPassword(dto.newPassword);
    await this.authRepository.updatePassword(userId, hashedPassword);

    this.logger.log(`Password changed for user: ${userId}`);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.authRepository.findByEmail(dto.email);

    // Always return silently — do not reveal whether the email exists
    if (!user) {
      return;
    }

    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(resetToken);
    const expiry = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await this.authRepository.setResetPasswordToken(user.id, tokenHash, expiry);

    // TODO: Emit mail event → this.eventEmitter.emit('auth.password-reset', { user, resetToken })
    this.logger.log(`Password reset token generated for: ${user.email} | Token: ${resetToken}`);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = this.hashToken(dto.token);
    const user = await this.authRepository.findByResetPasswordToken(tokenHash);

    if (!user?.resetPasswordTokenExpiry) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (user.resetPasswordTokenExpiry < new Date()) {
      await this.authRepository.clearResetPasswordToken(user.id);
      throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await this.hashPassword(dto.newPassword);
    await this.authRepository.updatePassword(user.id, hashedPassword);
    await this.authRepository.clearResetPasswordToken(user.id);

    this.logger.log(`Password reset successful for: ${user.email}`);
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRoleEnum,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessPayload: JwtPayload = { sub: userId, email, role, type: TokenTypeEnum.ACCESS };
    const refreshPayload: JwtPayload = { sub: userId, email, role, type: TokenTypeEnum.REFRESH };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d') as StringValue,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private resolveRegistrationRole(requestedRole?: UserRoleEnum): UserRoleEnum {
    if (!requestedRole) {
      return DEFAULT_REGISTER_ROLE;
    }

    if (!SELF_REGISTERABLE_ROLES.includes(requestedRole)) {
      throw new BadRequestException(
        `Role '${requestedRole}' cannot be self-assigned during registration`,
      );
    }

    return requestedRole;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  private async verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
