import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import ExcelJS from 'exceljs';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import type { PaginationMeta } from '../../common/dto/pagination.dto';
import { buildPaginationMeta } from '../../common/dto/pagination.dto';
import { SortDirectionEnum } from '../../common/enums/sort-direction.enum';
import { JobStatusEnum } from '../../common/enums/jobs/job-status.enum';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { toStatusCounts } from '../../common/utils/status-counts';
import { tally } from '../../common/utils/tally';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { JobsRepository } from './repositories/jobs.repository';
import { JobTransformer } from './transformers/job.transformer';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobQueryDto } from './dto/job-query.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { BulkUploadResultDto } from './dto/bulk-upload-result.dto';
import { JobStatsDto } from './dto/job-stats.dto';

function cellToString(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'object') {
    if ('text' in value) return String(value.text ?? '');
    if ('richText' in value) return value.richText.map((part) => part.text).join('');
  }
  return '';
}

const BULK_UPLOAD_COLUMNS = [
  'title',
  'company',
  'city',
  'qualification',
  'jobDescription',
  'experience',
  'workType',
  'jobFunction',
  'sector',
] as const;

const SORTABLE_COLUMNS = [
  'title',
  'company',
  'city',
  'status',
  'sector',
  'workType',
  'createdAt',
  'updatedAt',
] as const;
const DEFAULT_SORT_COLUMN = 'createdAt';
const JOB_RETENTION_DAYS = 21;
// Jobs this close to the retention cutoff count as "expiring soon" in the dashboard stats.
const EXPIRY_WARNING_DAYS = 7;
// Roles that manage every job, including unowned ones. Today the controller only admits these two
// roles, so the own-jobs-only scoping below is a safety net for any role let in later (e.g. EXECUTIVE).
const hasFullAccess = (actor: AuthenticatedUser) =>
  actor.role === UserRoleEnum.SUPER_ADMIN || actor.role === UserRoleEnum.ADMIN;

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly jobTransformer: JobTransformer,
  ) {}

  async create(actor: AuthenticatedUser, dto: CreateJobDto): Promise<JobResponseDto> {
    const job = await this.jobsRepository.create({
      createdBy: { connect: { id: actor.id } },
      title: dto.title,
      company: dto.company,
      city: dto.city,
      qualification: dto.qualification,
      jobDescription: dto.jobDescription,
      experience: dto.experience,
      workType: dto.workType,
      jobFunction: dto.jobFunction,
      status: dto.status,
      sector: dto.sector,
    });

    this.logger.log(`Job created: ${job.id} (${job.title})`);
    return this.jobTransformer.transform(job);
  }

  /** Public listing when `actor` is omitted; otherwise the dashboard listing, scoped by role. */
  async findAll(
    query: JobQueryDto,
    actor?: AuthenticatedUser,
  ): Promise<{ data: JobResponseDto[]; meta: PaginationMeta }> {
    const where = this.buildWhere(query);
    if (actor) {
      Object.assign(where, this.ownerScope(actor));
    } else {
      // Public visitors only ever see published jobs, whatever `status` they ask for.
      where.status = JobStatusEnum.ACTIVE;
    }
    const orderBy = this.buildOrderBy(query);
    const skip = (query.page - 1) * query.limit;

    const [jobs, total] = await Promise.all([
      this.jobsRepository.findMany({ skip, take: query.limit, where, orderBy }),
      this.jobsRepository.count(where),
    ]);

    return {
      data: this.jobTransformer.transformMany(jobs),
      meta: buildPaginationMeta(query.page, query.limit, total),
    };
  }

  /** Dashboard counters, scoped by role the same way as the dashboard listing. */
  async getStats(actor: AuthenticatedUser): Promise<JobStatsDto> {
    const where = this.ownerScope(actor);
    const expiryCutoff = new Date(
      Date.now() - (JOB_RETENTION_DAYS - EXPIRY_WARNING_DAYS) * 24 * 60 * 60 * 1000,
    );
    const expiringWhere = { ...where, createdAt: { lte: expiryCutoff } };
    // ponytail: breakdowns are tallied in memory; fine while the 21-day retention keeps the
    // table small. Switch to Prisma groupBy per column if it ever grows large.
    const [groups, expiringSoon, expiring, rows, recent] = await Promise.all([
      this.jobsRepository.countByStatus(where),
      this.jobsRepository.count(expiringWhere),
      this.jobsRepository.findMany({
        skip: 0,
        take: 5,
        where: expiringWhere,
        orderBy: { createdAt: 'asc' },
      }),
      this.jobsRepository.findForBreakdown(where),
      this.jobsRepository.findMany({ skip: 0, take: 5, where, orderBy: { updatedAt: 'desc' } }),
    ]);
    const active = rows.filter((row) => row.status === JobStatusEnum.ACTIVE);

    return {
      ...toStatusCounts(Object.values(JobStatusEnum), groups),
      expiringSoon,
      expiringJobs: expiring.map(({ id, title, company, createdAt }) => ({
        id,
        title,
        company,
        deletesAt: new Date(createdAt.getTime() + JOB_RETENTION_DAYS * 24 * 60 * 60 * 1000),
      })),
      bySector: tally(active, (row) => row.sector),
      byWorkType: tally(active, (row) => row.workType),
      topCities: tally(active, (row) => row.city, 5),
      ...(hasFullAccess(actor) && {
        byOwner: tally(rows, (row) => row.createdBy?.name ?? 'Unassigned'),
      }),
      recent: recent.map(({ id, title, status, updatedAt }) => ({
        id,
        title,
        status: status,
        updatedAt,
      })),
    };
  }

  /** Public job detail: unpublished jobs are reported as not found. */
  async findOne(id: string): Promise<JobResponseDto> {
    const job = await this.jobsRepository.findById(id);
    if (!job || job.status !== JobStatusEnum.ACTIVE) {
      throw new EntityNotFoundException('Job', id);
    }
    return this.jobTransformer.transform(job);
  }

  async update(actor: AuthenticatedUser, id: string, dto: UpdateJobDto): Promise<JobResponseDto> {
    await this.getManageableJobOrThrow(actor, id);

    const job = await this.jobsRepository.update(id, {
      title: dto.title,
      company: dto.company,
      city: dto.city,
      qualification: dto.qualification,
      jobDescription: dto.jobDescription,
      experience: dto.experience,
      workType: dto.workType,
      jobFunction: dto.jobFunction,
      status: dto.status,
      sector: dto.sector,
    });

    this.logger.log(`Job updated: ${job.id}`);
    return this.jobTransformer.transform(job);
  }

  async remove(actor: AuthenticatedUser, id: string): Promise<void> {
    await this.getManageableJobOrThrow(actor, id);

    await this.jobsRepository.delete(id);
    this.logger.log(`Job deleted by ${actor.id}: ${id}`);
  }

  // SUPER_ADMIN and ADMIN see every job; any other role only the jobs they created.
  private ownerScope(actor: AuthenticatedUser): Prisma.JobWhereInput {
    return hasFullAccess(actor) ? {} : { createdById: actor.id };
  }

  // Roles without full access may only touch jobs they created. Someone else's job is reported as not found
  // rather than forbidden, so its existence isn't leaked.
  private async getManageableJobOrThrow(actor: AuthenticatedUser, id: string) {
    const job = await this.jobsRepository.findById(id);
    if (!job || (!hasFullAccess(actor) && job.createdById !== actor.id)) {
      throw new EntityNotFoundException('Job', id);
    }
    return job;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeExpiredJobs(): Promise<void> {
    const cutoff = new Date(Date.now() - JOB_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const count = await this.jobsRepository.deleteOlderThan(cutoff);
    if (count > 0) {
      this.logger.log(`Removed ${count} job(s) older than ${JOB_RETENTION_DAYS} days`);
    }
  }

  async bulkCreate(actor: AuthenticatedUser, buffer: Buffer): Promise<BulkUploadResultDto> {
    const workbook = new ExcelJS.Workbook();
    // exceljs ships Buffer typings that predate @types/node's generic Buffer<T> — safe cast, same runtime type.
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('The uploaded file has no worksheet');
    }

    const columns = new Map<string, number>();
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      columns.set(cellToString(cell.value).trim(), colNumber);
    });

    const missing = BULK_UPLOAD_COLUMNS.filter((column) => !columns.has(column));
    if (missing.length > 0) {
      throw new BadRequestException(`Missing required column(s): ${missing.join(', ')}`);
    }

    const cellValue = (row: ExcelJS.Row, column: string): string => {
      const colNumber = columns.get(column);
      return colNumber ? cellToString(row.getCell(colNumber).value).trim() : '';
    };

    const validJobs: Prisma.JobCreateManyInput[] = [];
    const errors: { row: number; message: string }[] = [];
    let totalRows = 0;

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      if (row.actualCellCount === 0) {
        continue;
      }
      totalRows++;

      const dto = plainToInstance(CreateJobDto, {
        title: cellValue(row, 'title'),
        company: cellValue(row, 'company'),
        city: cellValue(row, 'city'),
        qualification: cellValue(row, 'qualification'),
        jobDescription: cellValue(row, 'jobDescription'),
        experience: cellValue(row, 'experience'),
        workType: cellValue(row, 'workType'),
        jobFunction: cellValue(row, 'jobFunction'),
        status: cellValue(row, 'status') || undefined,
        sector: cellValue(row, 'sector'),
      });

      const validationErrors = await validate(dto);
      if (validationErrors.length > 0) {
        errors.push({
          row: rowNumber,
          message: validationErrors
            .map((error) => Object.values(error.constraints ?? {}).join(', '))
            .join('; '),
        });
        continue;
      }

      validJobs.push({
        createdById: actor.id,
        title: dto.title,
        company: dto.company,
        city: dto.city,
        qualification: dto.qualification,
        jobDescription: dto.jobDescription,
        experience: dto.experience,
        workType: dto.workType,
        jobFunction: dto.jobFunction,
        status: dto.status,
        sector: dto.sector,
      });
    }

    const created = validJobs.length > 0 ? await this.jobsRepository.createMany(validJobs) : 0;
    this.logger.log(
      `Bulk upload: ${created} created, ${errors.length} failed of ${totalRows} rows`,
    );

    return { totalRows, created, failed: errors.length, errors };
  }

  private buildWhere(query: JobQueryDto): Prisma.JobWhereInput {
    const where: Prisma.JobWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { company: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.sector) {
      where.sector = query.sector;
    }

    if (query.workType) {
      where.workType = query.workType;
    }

    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }

    if (query.experience) {
      where.experience = { contains: query.experience, mode: 'insensitive' };
    }

    if (query.jobFunction) {
      where.jobFunction = { contains: query.jobFunction, mode: 'insensitive' };
    }

    if (query.createdFrom || query.createdTo) {
      where.createdAt = {
        ...(query.createdFrom && { gte: new Date(query.createdFrom) }),
        ...(query.createdTo && { lte: new Date(query.createdTo) }),
      };
    }

    return where;
  }

  private buildOrderBy(query: JobQueryDto): Prisma.JobOrderByWithRelationInput {
    const column = SORTABLE_COLUMNS.includes(query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      ? (query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      : DEFAULT_SORT_COLUMN;

    return { [column]: query.sortOrder === SortDirectionEnum.ASC ? 'asc' : 'desc' };
  }
}
