import { Injectable } from '@nestjs/common';
import type { Blog } from '@prisma/client';
import { BaseTransformer } from '../../../common/transformers/base.transformer';
import { BlogStatusEnum } from '../../../common/enums/blogs/blog-status.enum';
import { BlogResponseDto } from '../dto/blog-response.dto';

@Injectable()
export class BlogTransformer extends BaseTransformer<Blog, BlogResponseDto> {
  transform(blog: Blog): BlogResponseDto {
    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      category: blog.category,
      tags: blog.tags,
      status: blog.status as unknown as BlogStatusEnum,
      isFeatured: blog.isFeatured,
      seoTitle: blog.seoTitle,
      seoDescription: blog.seoDescription,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }
}
