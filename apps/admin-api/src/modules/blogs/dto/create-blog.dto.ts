import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BlogStatusEnum } from '../../../common/enums/blogs/blog-status.enum';

function toBoolean({ value }: { value: unknown }): unknown {
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return value;
}

function toStringArray({ value }: { value: unknown }): unknown {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return value;

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not a JSON array, fall back to comma-separated parsing
  }

  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export class CreateBlogDto {
  @ApiProperty({ example: 'Understanding Pharmacovigilance in 2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: '<p>Full article content...</p>' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ example: 'A short summary of the article' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ example: 'Regulatory Affairs' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['pharmacovigilance', 'compliance'],
    description: 'Array of tags, or a comma-separated string when sent as multipart/form-data',
  })
  @IsOptional()
  @Transform(toStringArray)
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: BlogStatusEnum, default: BlogStatusEnum.DRAFT })
  @IsOptional()
  @IsEnum(BlogStatusEnum)
  status?: BlogStatusEnum;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 'Understanding Pharmacovigilance | PharmaConnect' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'Learn the fundamentals of pharmacovigilance in this guide.' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoDescription?: string;

  @ApiPropertyOptional({ example: '2026-07-15' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
