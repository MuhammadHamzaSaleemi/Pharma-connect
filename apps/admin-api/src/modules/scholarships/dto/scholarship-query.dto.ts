import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ScholarshipStatusEnum } from '../../../common/enums/scholarships/scholarship-status.enum';

export class ScholarshipQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ScholarshipStatusEnum })
  @IsOptional()
  @IsEnum(ScholarshipStatusEnum)
  status?: ScholarshipStatusEnum;

  @ApiPropertyOptional({ example: 'Canada' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: '2026-09-01',
    description: 'Return scholarships starting on/after this date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2027-03-01',
    description: 'Return scholarships ending on/before this date',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
