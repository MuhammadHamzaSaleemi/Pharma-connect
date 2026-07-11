import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsRepository } from './repositories/jobs.repository';
import { JobTransformer } from './transformers/job.transformer';

@Module({
  controllers: [JobsController],
  providers: [JobsService, JobsRepository, JobTransformer],
})
export class JobsModule {}
