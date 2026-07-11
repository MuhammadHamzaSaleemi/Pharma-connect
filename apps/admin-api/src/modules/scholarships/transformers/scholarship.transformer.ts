import { Injectable } from '@nestjs/common';
import type { Scholarship } from '@prisma/client';
import { BaseTransformer } from '../../../common/transformers/base.transformer';
import { ScholarshipStatusEnum } from '../../../common/enums/scholarships/scholarship-status.enum';
import { ScholarshipResponseDto } from '../dto/scholarship-response.dto';

@Injectable()
export class ScholarshipTransformer extends BaseTransformer<Scholarship, ScholarshipResponseDto> {
  transform(scholarship: Scholarship): ScholarshipResponseDto {
    return {
      id: scholarship.id,
      image: scholarship.image,
      country: scholarship.country,
      startDate: scholarship.startDate.toISOString(),
      endDate: scholarship.endDate.toISOString(),
      financialBenefits: scholarship.financialBenefits,
      eligibilityCriteria: scholarship.eligibilityCriteria,
      howToApply: scholarship.howToApply,
      status: scholarship.status as unknown as ScholarshipStatusEnum,
      createdAt: scholarship.createdAt,
      updatedAt: scholarship.updatedAt,
    };
  }
}
