import { ApiProperty } from '@nestjs/swagger';
import { JobStatusEnum } from '../../../common/enums/jobs/job-status.enum';
import { LabelCountDto } from '../../../common/utils/tally';

export class ExpiringJobDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  company!: string;

  @ApiProperty({ description: 'When the daily cleanup becomes due to delete this job' })
  deletesAt!: Date;
}

export class RecentJobDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: JobStatusEnum })
  status!: JobStatusEnum;

  @ApiProperty()
  updatedAt!: Date;
}

export class JobStatsDto {
  @ApiProperty({ example: 72 })
  total!: number;

  @ApiProperty({ example: { ACTIVE: 45, DRAFT: 9, INACTIVE: 9, CLOSED: 9 } })
  byStatus!: Record<JobStatusEnum, number>;

  @ApiProperty({ example: 6, description: 'Jobs the daily cleanup will delete within 7 days' })
  expiringSoon!: number;

  @ApiProperty({ type: [ExpiringJobDto], description: 'The 5 jobs due for deletion soonest' })
  expiringJobs!: ExpiringJobDto[];

  @ApiProperty({ type: [LabelCountDto], description: 'Active jobs per sector' })
  bySector!: LabelCountDto[];

  @ApiProperty({ type: [LabelCountDto], description: 'Active jobs per work type' })
  byWorkType!: LabelCountDto[];

  @ApiProperty({ type: [LabelCountDto], description: 'Top 5 cities by active jobs' })
  topCities!: LabelCountDto[];

  @ApiProperty({
    type: [LabelCountDto],
    required: false,
    description: 'Jobs per creator; SUPER_ADMIN and ADMIN only',
  })
  byOwner?: LabelCountDto[];

  @ApiProperty({ type: [RecentJobDto], description: 'The 5 most recently updated jobs' })
  recent!: RecentJobDto[];
}
