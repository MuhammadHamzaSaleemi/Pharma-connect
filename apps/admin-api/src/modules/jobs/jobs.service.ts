import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import type { PaginationMeta } from '../../common/dto/pagination.dto';
import { buildPaginationMeta } from '../../common/dto/pagination.dto';
import { SortDirectionEnum } from '../../common/enums/sort-direction.enum';
import { JobsRepository } from './repositories/jobs.repository';
import { JobTransformer } from './transformers/job.transformer';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobQueryDto } from './dto/job-query.dto';
import { JobResponseDto } from './dto/job-response.dto';

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

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly jobTransformer: JobTransformer,
  ) {}

  async create(dto: CreateJobDto): Promise<JobResponseDto> {
    const job = await this.jobsRepository.create({
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

  async findAll(query: JobQueryDto): Promise<{ data: JobResponseDto[]; meta: PaginationMeta }> {
    const where = this.buildWhere(query);
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

  async findOne(id: string): Promise<JobResponseDto> {
    const job = await this.jobsRepository.findById(id);
    if (!job) {
      throw new EntityNotFoundException('Job', id);
    }
    return this.jobTransformer.transform(job);
  }

  async update(id: string, dto: UpdateJobDto): Promise<JobResponseDto> {
    const existing = await this.jobsRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundException('Job', id);
    }

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

  async remove(id: string): Promise<void> {
    const existing = await this.jobsRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundException('Job', id);
    }

    await this.jobsRepository.delete(id);
    this.logger.log(`Job deleted: ${id}`);
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
      where.city = query.city;
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
