import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import type { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import type { PaginationMeta } from '../../common/dto/pagination.dto';
import { buildPaginationMeta } from '../../common/dto/pagination.dto';
import { SortDirectionEnum } from '../../common/enums/sort-direction.enum';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { UserStatusEnum } from '../../common/enums/user-status.enum';
import { toStatusCounts } from '../../common/utils/status-counts';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { AuthTransformer } from '../auth/transformers/auth.transformer';
import type { CurrentUserDto } from '../auth/dto/current-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import type { UserStatsDto } from './dto/user-stats.dto';

const BCRYPT_ROUNDS = 12;
const SORTABLE_COLUMNS = ['name', 'email', 'role', 'status', 'createdAt'] as const;
const DEFAULT_SORT_COLUMN = 'createdAt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userTransformer: AuthTransformer,
  ) {}

  async create(actor: AuthenticatedUser, dto: CreateUserDto): Promise<CurrentUserDto> {
    this.assertCanManage(actor, undefined, dto.role);
    await this.assertEmailAvailable(dto.email);

    const user = await this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
      role: dto.role,
      status: dto.status,
    });

    this.logger.log(`User created by ${actor.id}: ${user.id} (${user.email})`);
    return this.userTransformer.transform(user);
  }

  async findAll(query: UserQueryDto): Promise<{ data: CurrentUserDto[]; meta: PaginationMeta }> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query);
    const skip = (query.page - 1) * query.limit;

    const [users, total] = await Promise.all([
      this.usersRepository.findMany({ skip, take: query.limit, where, orderBy }),
      this.usersRepository.count(where),
    ]);

    return {
      data: this.userTransformer.transformMany(users),
      meta: buildPaginationMeta(query.page, query.limit, total),
    };
  }

  /** Dashboard counters. */
  async getStats(): Promise<UserStatsDto> {
    const groups = await this.usersRepository.countByStatus();
    return toStatusCounts(Object.values(UserStatusEnum), groups);
  }

  async findOne(id: string): Promise<CurrentUserDto> {
    return this.userTransformer.transform(await this.getUserOrThrow(id));
  }

  async update(actor: AuthenticatedUser, id: string, dto: UpdateUserDto): Promise<CurrentUserDto> {
    const existing = await this.getUserOrThrow(id);
    this.assertCanManage(actor, existing, dto.role);

    const roleChanged = dto.role !== undefined && dto.role !== existing.role;
    const statusChanged = dto.status !== undefined && dto.status !== existing.status;
    if (actor.id === id && (roleChanged || statusChanged)) {
      throw new BadRequestException('You cannot change your own role or status');
    }
    if (dto.email && dto.email !== existing.email) {
      await this.assertEmailAvailable(dto.email);
    }

    // Revoke existing sessions whenever credentials or access level change.
    const revokeSessions = !!dto.password || roleChanged || statusChanged;
    const user = await this.usersRepository.update(id, {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      status: dto.status,
      password: dto.password ? await bcrypt.hash(dto.password, BCRYPT_ROUNDS) : undefined,
      ...(revokeSessions && { refreshTokenHash: null, tokenValidFrom: new Date() }),
    });

    this.logger.log(`User updated by ${actor.id}: ${user.id}`);
    return this.userTransformer.transform(user);
  }

  async remove(actor: AuthenticatedUser, id: string): Promise<void> {
    if (actor.id === id) {
      throw new BadRequestException('You cannot delete your own account');
    }
    this.assertCanManage(actor, await this.getUserOrThrow(id));

    await this.usersRepository.delete(id);
    this.logger.log(`User deleted by ${actor.id}: ${id}`);
  }

  // ADMIN may manage users too, but never a SUPER_ADMIN account or the SUPER_ADMIN role:
  // otherwise an admin could reset a super admin's password or promote someone to super admin.
  private assertCanManage(actor: AuthenticatedUser, target?: User, nextRole?: UserRoleEnum): void {
    if (actor.role === UserRoleEnum.SUPER_ADMIN) return;
    if (nextRole === UserRoleEnum.SUPER_ADMIN || target?.role === UserRoleEnum.SUPER_ADMIN) {
      throw new ForbiddenException('Only a super admin can manage super admin accounts');
    }
  }

  private async getUserOrThrow(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundException('User', id);
    }
    return user;
  }

  private async assertEmailAvailable(email: string): Promise<void> {
    if (await this.usersRepository.findByEmail(email)) {
      throw new BadRequestException('Email is already registered');
    }
  }

  private buildWhere(query: UserQueryDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.role) {
      where.role = query.role;
    }
    if (query.status) {
      where.status = query.status;
    }

    return where;
  }

  private buildOrderBy(query: UserQueryDto): Prisma.UserOrderByWithRelationInput {
    const column = SORTABLE_COLUMNS.includes(query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      ? (query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      : DEFAULT_SORT_COLUMN;

    return { [column]: query.sortOrder === SortDirectionEnum.ASC ? 'asc' : 'desc' };
  }
}
