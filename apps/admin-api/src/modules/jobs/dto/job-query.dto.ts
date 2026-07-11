import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
}
