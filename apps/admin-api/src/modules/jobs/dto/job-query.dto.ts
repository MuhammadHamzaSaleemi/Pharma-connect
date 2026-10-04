import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { JobStatusEnum } from '../../../common/enums/jobs/job-status.enum';
import { SectorEnum } from '../../../common/enums/jobs/sector.enum';
import { WorkTypeEnum } from '../../../common/enums/jobs/work-type.enum';

export class JobQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: JobStatusEnum })
  @IsOptional()
  @IsEnum(JobStatusEnum)
  status?: JobStatusEnum;

  @ApiPropertyOptional({ enum: SectorEnum })
  @IsOptional()
  @IsEnum(SectorEnum)
  sector?: SectorEnum;

  @ApiPropertyOptional({ enum: WorkTypeEnum })
  @IsOptional()
  @IsEnum(WorkTypeEnum)
  workType?: WorkTypeEnum;

  @ApiPropertyOptional({ example: 'Lahore' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '2-4 years' })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional({ example: 'Production' })
  @IsOptional()
  @IsString()
  jobFunction?: string;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z', description: 'createdAt >= this' })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiPropertyOptional({ example: '2026-01-31T23:59:59.999Z', description: 'createdAt <= this' })
  @IsOptional()
  @IsDateString()
  createdTo?: string;
}
