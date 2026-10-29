import { Injectable } from '@nestjs/common';
import type { Blog } from '@prisma/client';
import { BaseTransformer } from '../../../common/transformers/base.transformer';
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
      status: blog.status,
      isFeatured: blog.isFeatured,
      seoTitle: blog.seoTitle,
      seoDescription: blog.seoDescription,
      publishedAt: blog.publishedAt,
      authorName: blog.authorName,
      authorTitle: blog.authorTitle,
      authorBio: blog.authorBio,
      authorImage: blog.authorImage,
      authorLinkedin: blog.authorLinkedin,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }
}
