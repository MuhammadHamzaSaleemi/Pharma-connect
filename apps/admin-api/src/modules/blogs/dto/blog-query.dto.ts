import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
}
