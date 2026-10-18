import { ApiProperty } from '@nestjs/swagger';
import { ScholarshipStatusEnum } from '../../../common/enums/scholarships/scholarship-status.enum';
import { LabelCountDto } from '../../../common/utils/tally';

export class ClosingScholarshipDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Canada' })
  country!: string;

  @ApiProperty()
  endDate!: Date;
}

export class RecentScholarshipDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Canada' })
  country!: string;

  @ApiProperty({ enum: ScholarshipStatusEnum })
  status!: ScholarshipStatusEnum;

  @ApiProperty()
  updatedAt!: Date;
}

export class ScholarshipStatsDto {
  @ApiProperty({ example: 4 })
  total!: number;

  @ApiProperty({ example: { DRAFT: 1, ACTIVE: 2, INACTIVE: 0, EXPIRED: 1 } })
  byStatus!: Record<ScholarshipStatusEnum, number>;

  @ApiProperty({ example: 1, description: 'Active scholarships whose deadline is within 45 days' })
  closingSoon!: number;

  @ApiProperty({ type: [ClosingScholarshipDto], description: 'The 5 nearest active deadlines' })
  closingSoonItems!: ClosingScholarshipDto[];

  @ApiProperty({ type: [LabelCountDto], description: 'Active scholarships per country' })
  byCountry!: LabelCountDto[];

  @ApiProperty({ type: [RecentScholarshipDto], description: 'The 5 most recently updated' })
  recent!: RecentScholarshipDto[];
}
