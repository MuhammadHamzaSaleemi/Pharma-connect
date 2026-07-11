import { Injectable } from '@nestjs/common';
import type { Job } from '@prisma/client';
import { BaseTransformer } from '../../../common/transformers/base.transformer';
import { JobStatusEnum } from '../../../common/enums/jobs/job-status.enum';
import { SectorEnum } from '../../../common/enums/jobs/sector.enum';
import { WorkTypeEnum } from '../../../common/enums/jobs/work-type.enum';
import { JobResponseDto } from '../dto/job-response.dto';

@Injectable()
export class JobTransformer extends BaseTransformer<Job, JobResponseDto> {
  transform(job: Job): JobResponseDto {
    return {
      id: job.id,
      title: job.title,
      company: job.company,
      city: job.city,
      qualification: job.qualification,
      jobDescription: job.jobDescription,
      experience: job.experience,
      workType: job.workType as unknown as WorkTypeEnum,
      jobFunction: job.jobFunction,
      status: job.status as unknown as JobStatusEnum,
      sector: job.sector as unknown as SectorEnum,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
