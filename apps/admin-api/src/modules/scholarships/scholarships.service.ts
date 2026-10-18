import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Prisma } from '@prisma/client';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import type { PaginationMeta } from '../../common/dto/pagination.dto';
import { buildPaginationMeta } from '../../common/dto/pagination.dto';
import { SortDirectionEnum } from '../../common/enums/sort-direction.enum';
import { ScholarshipStatusEnum } from '../../common/enums/scholarships/scholarship-status.enum';
import { toStatusCounts } from '../../common/utils/status-counts';
import { tally } from '../../common/utils/tally';
import { ScholarshipsRepository } from './repositories/scholarships.repository';
import { ScholarshipStatsDto } from './dto/scholarship-stats.dto';
import { ScholarshipTransformer } from './transformers/scholarship.transformer';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { ScholarshipQueryDto } from './dto/scholarship-query.dto';
import { ScholarshipResponseDto } from './dto/scholarship-response.dto';

const SORTABLE_COLUMNS = [
  'country',
  'startDate',
  'endDate',
  'status',
  'createdAt',
  'updatedAt',
] as const;
const DEFAULT_SORT_COLUMN = 'createdAt';
// Same window the public scholarships page uses for its "closing soon" badge.
const CLOSING_SOON_DAYS = 45;

@Injectable()
export class ScholarshipsService {
  private readonly logger = new Logger(ScholarshipsService.name);

  constructor(
    private readonly scholarshipsRepository: ScholarshipsRepository,
    private readonly scholarshipTransformer: ScholarshipTransformer,
  ) {}

  async create(dto: CreateScholarshipDto): Promise<ScholarshipResponseDto> {
    this.assertDateRange(dto.startDate, dto.endDate);

    const scholarship = await this.scholarshipsRepository.create({
      image: dto.image,
      country: dto.country,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      financialBenefits: dto.financialBenefits,
      eligibilityCriteria: dto.eligibilityCriteria,
      howToApply: dto.howToApply,
      status: dto.status,
    });

    this.logger.log(`Scholarship created: ${scholarship.id} (${scholarship.country})`);
    return this.scholarshipTransformer.transform(scholarship);
  }

  /** Public listing by default (active scholarships only); `manage` is the dashboard listing. */
  async findAll(
    query: ScholarshipQueryDto,
    manage = false,
  ): Promise<{ data: ScholarshipResponseDto[]; meta: PaginationMeta }> {
    const where = this.buildWhere(query);
    if (!manage) {
      // Public visitors only ever see active scholarships, whatever `status` they ask for.
      where.status = ScholarshipStatusEnum.ACTIVE;
    }
    const orderBy = this.buildOrderBy(query);
    const skip = (query.page - 1) * query.limit;

    const [scholarships, total] = await Promise.all([
      this.scholarshipsRepository.findMany({ skip, take: query.limit, where, orderBy }),
      this.scholarshipsRepository.count(where),
    ]);

    return {
      data: this.scholarshipTransformer.transformMany(scholarships),
      meta: buildPaginationMeta(query.page, query.limit, total),
    };
  }

  /** Dashboard counters. */
  async getStats(): Promise<ScholarshipStatsDto> {
    const now = new Date();
    const closingBy = new Date(now.getTime() + CLOSING_SOON_DAYS * 24 * 60 * 60 * 1000);
    const closingWhere: Prisma.ScholarshipWhereInput = {
      status: ScholarshipStatusEnum.ACTIVE,
      endDate: { gte: now, lte: closingBy },
    };
    const [groups, closingSoon, closing, countries, recent] = await Promise.all([
      this.scholarshipsRepository.countByStatus(),
      this.scholarshipsRepository.count(closingWhere),
      this.scholarshipsRepository.findMany({
        skip: 0,
        take: 5,
        where: closingWhere,
        orderBy: { endDate: 'asc' },
      }),
      this.scholarshipsRepository.findCountries({ status: ScholarshipStatusEnum.ACTIVE }),
      this.scholarshipsRepository.findMany({
        skip: 0,
        take: 5,
        where: {},
        orderBy: { updatedAt: 'desc' },
      }),
    ]);
    return {
      ...toStatusCounts(Object.values(ScholarshipStatusEnum), groups),
      closingSoon,
      closingSoonItems: closing.map(({ id, country, endDate }) => ({ id, country, endDate })),
      byCountry: tally(countries, (row) => row.country),
      recent: recent.map(({ id, country, status, updatedAt }) => ({
        id,
        country,
        status: status,
        updatedAt,
      })),
    };
  }

  // Without this, an ACTIVE scholarship stays on the public site after its deadline.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expirePastDeadline(): Promise<void> {
    const count = await this.scholarshipsRepository.expirePastDeadline(new Date());
    if (count > 0) {
      this.logger.log(`Marked ${count} scholarship(s) past their deadline as EXPIRED`);
    }
  }

  /** Public detail: scholarships that aren't active are reported as not found. */
  async findOne(id: string): Promise<ScholarshipResponseDto> {
    const scholarship = await this.scholarshipsRepository.findById(id);
    if (!scholarship || scholarship.status !== ScholarshipStatusEnum.ACTIVE) {
      throw new EntityNotFoundException('Scholarship', id);
    }
    return this.scholarshipTransformer.transform(scholarship);
  }

  async update(id: string, dto: UpdateScholarshipDto): Promise<ScholarshipResponseDto> {
    const existing = await this.scholarshipsRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundException('Scholarship', id);
    }

    const nextStartDate = dto.startDate ?? existing.startDate.toISOString();
    const nextEndDate = dto.endDate ?? existing.endDate.toISOString();
    this.assertDateRange(nextStartDate, nextEndDate);

    const scholarship = await this.scholarshipsRepository.update(id, {
      image: dto.image,
      country: dto.country,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      financialBenefits: dto.financialBenefits,
      eligibilityCriteria: dto.eligibilityCriteria,
      howToApply: dto.howToApply,
      status: dto.status,
    });

    this.logger.log(`Scholarship updated: ${scholarship.id}`);
    return this.scholarshipTransformer.transform(scholarship);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.scholarshipsRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundException('Scholarship', id);
    }

    await this.scholarshipsRepository.delete(id);
    this.logger.log(`Scholarship deleted: ${id}`);
  }

  private assertDateRange(startDate: string, endDate: string): void {
    if (new Date(endDate).getTime() <= new Date(startDate).getTime()) {
      throw new BadRequestException('endDate must be after startDate');
    }
  }

  private buildWhere(query: ScholarshipQueryDto): Prisma.ScholarshipWhereInput {
    const where: Prisma.ScholarshipWhereInput = {};

    if (query.search) {
      where.OR = [
        { country: { contains: query.search, mode: 'insensitive' } },
        { financialBenefits: { contains: query.search, mode: 'insensitive' } },
        { eligibilityCriteria: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.country) {
      where.country = query.country;
    }

    if (query.startDate) {
      where.startDate = { gte: new Date(query.startDate) };
    }

    if (query.endDate) {
      where.endDate = { lte: new Date(query.endDate) };
    }

    return where;
  }

  private buildOrderBy(query: ScholarshipQueryDto): Prisma.ScholarshipOrderByWithRelationInput {
    const column = SORTABLE_COLUMNS.includes(query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      ? (query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      : DEFAULT_SORT_COLUMN;

    return { [column]: query.sortOrder === SortDirectionEnum.ASC ? 'asc' : 'desc' };
  }
}
