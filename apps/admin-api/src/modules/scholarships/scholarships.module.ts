import { Module } from '@nestjs/common';
import { ScholarshipsController } from './scholarships.controller';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipsRepository } from './repositories/scholarships.repository';
import { ScholarshipTransformer } from './transformers/scholarship.transformer';

@Module({
  controllers: [ScholarshipsController],
  providers: [ScholarshipsService, ScholarshipsRepository, ScholarshipTransformer],
})
export class ScholarshipsModule {}
