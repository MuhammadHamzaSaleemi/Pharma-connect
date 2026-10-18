import { ApiProperty } from '@nestjs/swagger';
import { BlogStatusEnum } from '../../../common/enums/blogs/blog-status.enum';

export class BlogRefDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: BlogStatusEnum })
  status!: BlogStatusEnum;

  @ApiProperty()
  updatedAt!: Date;
}

export class IncompleteBlogDto extends BlogRefDto {
  @ApiProperty({ example: ['excerpt', 'seoTitle'], description: 'Empty fields' })
  missing!: string[];
}

export class BlogStatsDto {
  @ApiProperty({ example: 4 })
  total!: number;

  @ApiProperty({ example: { DRAFT: 1, PUBLISHED: 3 } })
  byStatus!: Record<BlogStatusEnum, number>;

  @ApiProperty({ example: 1 })
  featured!: number;

  @ApiProperty({ example: 2, description: 'Drafts not edited for 14 days' })
  staleDrafts!: number;

  @ApiProperty({ type: [BlogRefDto], description: 'The 5 longest-untouched stale drafts' })
  staleDraftItems!: BlogRefDto[];

  @ApiProperty({
    example: 3,
    description: 'Published posts missing an excerpt, image or SEO field',
  })
  incomplete!: number;

  @ApiProperty({ type: [IncompleteBlogDto] })
  incompleteItems!: IncompleteBlogDto[];

  @ApiProperty({ type: [BlogRefDto], description: 'The 5 most recently updated' })
  recent!: BlogRefDto[];
}
