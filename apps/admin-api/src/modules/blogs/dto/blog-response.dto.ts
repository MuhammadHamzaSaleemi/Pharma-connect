import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogStatusEnum } from '../../../common/enums/blogs/blog-status.enum';

export class BlogResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  content!: string;

  @ApiPropertyOptional()
  excerpt?: string | null;

  @ApiPropertyOptional()
  featuredImage?: string | null;

  @ApiPropertyOptional()
  category?: string | null;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ enum: BlogStatusEnum })
  status!: BlogStatusEnum;

  @ApiProperty()
  isFeatured!: boolean;

  @ApiPropertyOptional()
  seoTitle?: string | null;

  @ApiPropertyOptional()
  seoDescription?: string | null;

  @ApiPropertyOptional()
  publishedAt?: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
