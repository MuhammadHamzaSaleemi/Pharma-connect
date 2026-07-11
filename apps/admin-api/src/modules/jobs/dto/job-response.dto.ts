import { ApiProperty } from '@nestjs/swagger';
import { JobStatusEnum } from '../../../common/enums/jobs/job-status.enum';
import { SectorEnum } from '../../../common/enums/jobs/sector.enum';
import { WorkTypeEnum } from '../../../common/enums/jobs/work-type.enum';

export class JobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  company!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  qualification!: string;

  @ApiProperty()
  jobDescription!: string;

  @ApiProperty()
  experience!: string;

  @ApiProperty({ enum: WorkTypeEnum })
  workType!: WorkTypeEnum;

  @ApiProperty()
  jobFunction!: string;

  @ApiProperty({ enum: JobStatusEnum })
  status!: JobStatusEnum;

  @ApiProperty({ enum: SectorEnum })
  sector!: SectorEnum;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
