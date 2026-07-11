import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsAfter } from '../../../common/validators/is-after.validator';
import { ScholarshipStatusEnum } from '../../../common/enums/scholarships/scholarship-status.enum';

export class CreateScholarshipDto {
  @ApiProperty({ example: 'https://cdn.pharmaconnect.com/scholarships/merit-2026.png' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  image!: string;

  @ApiProperty({ example: 'Canada' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country!: string;

  @ApiProperty({ example: '2026-09-01' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2027-03-01' })
  @IsDateString()
  @IsAfter('startDate')
  endDate!: string;

  @ApiProperty({ example: 'Full tuition waiver plus monthly stipend' })
  @IsString()
  @IsNotEmpty()
  financialBenefits!: string;

  @ApiProperty({ example: 'Minimum GPA of 3.5, pharmacy or related discipline' })
  @IsString()
  @IsNotEmpty()
  eligibilityCriteria!: string;

  @ApiProperty({ example: 'Apply online via the university portal before the deadline' })
  @IsString()
  @IsNotEmpty()
  howToApply!: string;

  @ApiPropertyOptional({ enum: ScholarshipStatusEnum, default: ScholarshipStatusEnum.DRAFT })
  @IsOptional()
  @IsEnum(ScholarshipStatusEnum)
  status?: ScholarshipStatusEnum;
}
