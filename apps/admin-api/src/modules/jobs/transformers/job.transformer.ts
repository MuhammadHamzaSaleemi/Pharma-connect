import { Injectable } from '@nestjs/common';
import type { Job } from '@prisma/client';
import { BaseTransformer } from '../../../common/transformers/base.transformer';
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
      workType: job.workType,
      jobFunction: job.jobFunction,
      status: job.status,
      sector: job.sector,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
