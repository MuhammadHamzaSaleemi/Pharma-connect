import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import type { PaginationMeta } from '../../common/dto/pagination.dto';
import { buildPaginationMeta } from '../../common/dto/pagination.dto';
import { SortDirectionEnum } from '../../common/enums/sort-direction.enum';
import { BLOG_UPLOADS_DIR } from './config/blog-image.multer-options';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogTransformer } from './transformers/blog.transformer';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { BlogResponseDto } from './dto/blog-response.dto';

const SORTABLE_COLUMNS = [
  'title',
  'category',
  'status',
  'publishedAt',
  'createdAt',
  'updatedAt',
] as const;
const DEFAULT_SORT_COLUMN = 'createdAt';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly blogTransformer: BlogTransformer,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateBlogDto, featuredImage?: Express.Multer.File): Promise<BlogResponseDto> {
    const slug = await this.generateUniqueSlug(dto.title);

    const blog = await this.blogsRepository.create({
      title: dto.title,
      slug,
      content: dto.content,
      excerpt: dto.excerpt,
      featuredImage: featuredImage ? this.buildFeaturedImageUrl(featuredImage) : undefined,
      category: dto.category,
      tags: dto.tags ?? [],
      status: dto.status,
      isFeatured: dto.isFeatured,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });

    this.logger.log(`Blog created: ${blog.id} (${blog.slug})`);
    return this.blogTransformer.transform(blog);
  }

  async findAll(query: BlogQueryDto): Promise<{ data: BlogResponseDto[]; meta: PaginationMeta }> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query);
    const skip = (query.page - 1) * query.limit;

    const [blogs, total] = await Promise.all([
      this.blogsRepository.findMany({ skip, take: query.limit, where, orderBy }),
      this.blogsRepository.count(where),
    ]);

    return {
      data: this.blogTransformer.transformMany(blogs),
      meta: buildPaginationMeta(query.page, query.limit, total),
    };
  }

  async findOne(id: string): Promise<BlogResponseDto> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new EntityNotFoundException('Blog', id);
    }
    return this.blogTransformer.transform(blog);
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    featuredImage?: Express.Multer.File,
  ): Promise<BlogResponseDto> {
    const existing = await this.blogsRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundException('Blog', id);
    }

    const slug =
      dto.title && dto.title !== existing.title
        ? await this.generateUniqueSlug(dto.title, existing.id)
        : undefined;

    const blog = await this.blogsRepository.update(id, {
      title: dto.title,
      slug,
      content: dto.content,
      excerpt: dto.excerpt,
      featuredImage: featuredImage ? this.buildFeaturedImageUrl(featuredImage) : undefined,
      category: dto.category,
      tags: dto.tags,
      status: dto.status,
      isFeatured: dto.isFeatured,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });

    if (featuredImage && existing.featuredImage) {
      await this.deleteLocalFeaturedImage(existing.featuredImage);
    }

    this.logger.log(`Blog updated: ${blog.id}`);
    return this.blogTransformer.transform(blog);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.blogsRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundException('Blog', id);
    }

    await this.blogsRepository.delete(id);

    if (existing.featuredImage) {
      await this.deleteLocalFeaturedImage(existing.featuredImage);
    }

    this.logger.log(`Blog deleted: ${id}`);
  }

  private buildFeaturedImageUrl(file: Express.Multer.File): string {
    const appUrl = this.configService.get<string>('appUrl') ?? 'http://localhost:5000';
    return `${appUrl}/uploads/blogs/${file.filename}`;
  }

  private async deleteLocalFeaturedImage(url: string): Promise<void> {
    const appUrl = this.configService.get<string>('appUrl') ?? 'http://localhost:5000';
    const prefix = `${appUrl}/uploads/blogs/`;
    if (!url.startsWith(prefix)) {
      return;
    }

    const filename = url.slice(prefix.length);
    try {
      await unlink(join(BLOG_UPLOADS_DIR, filename));
    } catch (error) {
      this.logger.warn(
        `Failed to delete featured image file "${filename}": ${(error as Error).message}`,
      );
    }
  }

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = this.slugify(title);
    let slug = baseSlug;
    let suffix = 2;

    while (await this.blogsRepository.existsBySlug(slug, excludeId)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  private buildWhere(query: BlogQueryDto): Prisma.BlogWhereInput {
    const where: Prisma.BlogWhereInput = {};

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    return where;
  }

  private buildOrderBy(query: BlogQueryDto): Prisma.BlogOrderByWithRelationInput {
    const column = SORTABLE_COLUMNS.includes(query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      ? (query.sortBy as (typeof SORTABLE_COLUMNS)[number])
      : DEFAULT_SORT_COLUMN;

    return { [column]: query.sortOrder === SortDirectionEnum.ASC ? 'asc' : 'desc' };
  }
}
