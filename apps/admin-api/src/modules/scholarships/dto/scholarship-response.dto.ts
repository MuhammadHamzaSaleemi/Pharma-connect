import { ApiProperty } from '@nestjs/swagger';
import { ScholarshipStatusEnum } from '../../../common/enums/scholarships/scholarship-status.enum';

export class ScholarshipResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  image!: string;

  @ApiProperty()
  country!: string;

  @ApiProperty()
  startDate!: string;

  @ApiProperty()
  endDate!: string;

  @ApiProperty()
  financialBenefits!: string;

  @ApiProperty()
  eligibilityCriteria!: string;

  @ApiProperty()
  howToApply!: string;

  @ApiProperty({ enum: ScholarshipStatusEnum })
  status!: ScholarshipStatusEnum;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
