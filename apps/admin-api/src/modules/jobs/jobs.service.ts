import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import ExcelJS from 'exceljs';
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
import { BulkUploadResultDto } from './dto/bulk-upload-result.dto';

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

  async bulkCreate(buffer: Buffer): Promise<BulkUploadResultDto> {
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

    return where;
  }

  private buildOrderBy(query: JobQueryDto): Prisma.JobOrderByWithRelationInput {
    const column = SORTABLE_COLUMNS.includes(query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      ? (query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      : DEFAULT_SORT_COLUMN;

    return { [column]: query.sortOrder === SortDirectionEnum.ASC ? 'asc' : 'desc' };
  }
}
