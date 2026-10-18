import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { BlogStatusEnum } from '../../../common/enums/blogs/blog-status.enum';

export class BlogQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: BlogStatusEnum })
  @IsOptional()
  @IsEnum(BlogStatusEnum)
  status?: BlogStatusEnum;

  @ApiPropertyOptional({ example: 'Regulatory Affairs' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  // Read the raw query string: implicit conversion would turn "false" into true.
  @Transform(({ obj }: { obj: Record<string, unknown> }) =>
    obj.isFeatured === 'true' ? true : obj.isFeatured === 'false' ? false : obj.isFeatured,
  )
  @IsBoolean()
  isFeatured?: boolean;
}
