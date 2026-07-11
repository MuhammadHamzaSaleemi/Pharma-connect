import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { JobStatusEnum } from '../../../common/enums/jobs/job-status.enum';
import { SectorEnum } from '../../../common/enums/jobs/sector.enum';
import { WorkTypeEnum } from '../../../common/enums/jobs/work-type.enum';

export class CreateJobDto {
  @ApiProperty({ example: 'Production Pharmacist' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'PharmaConnect Labs' })
  @IsString()
  @IsNotEmpty()
  company!: string;

  @ApiProperty({ example: 'Lahore' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 'PharmD / B.Pharm' })
  @IsString()
  @IsNotEmpty()
  qualification!: string;

  @ApiProperty({ example: 'Responsible for overseeing production line quality...' })
  @IsString()
  @IsNotEmpty()
  jobDescription!: string;

  @ApiProperty({ example: '2-4 years' })
  @IsString()
  @IsNotEmpty()
  experience!: string;

  @ApiProperty({ enum: WorkTypeEnum, example: WorkTypeEnum.ON_SITE })
  @IsEnum(WorkTypeEnum)
  workType!: WorkTypeEnum;

  @ApiProperty({ example: 'Production' })
  @IsString()
  @IsNotEmpty()
  jobFunction!: string;

  @ApiPropertyOptional({ enum: JobStatusEnum, default: JobStatusEnum.DRAFT })
  @IsOptional()
  @IsEnum(JobStatusEnum)
  status?: JobStatusEnum;

  @ApiProperty({ enum: SectorEnum, example: SectorEnum.PRODUCTION })
  @IsEnum(SectorEnum)
  sector!: SectorEnum;
}
