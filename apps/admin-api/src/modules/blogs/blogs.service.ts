import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Blog, Prisma } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import type { PaginationMeta } from '../../common/dto/pagination.dto';
import { buildPaginationMeta } from '../../common/dto/pagination.dto';
import { SortDirectionEnum } from '../../common/enums/sort-direction.enum';
import { BlogStatusEnum } from '../../common/enums/blogs/blog-status.enum';
import { toStatusCounts } from '../../common/utils/status-counts';
import { BlogStatsDto } from './dto/blog-stats.dto';
import { uploadsDir } from '../../common/uploads/image-upload.options';
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
// Dashboard "needs attention": drafts untouched this long, and published posts missing any of
// these fields (they feed the blog cards and search-result snippets).
const STALE_DRAFT_DAYS = 14;
const SEO_FIELDS = ['excerpt', 'featuredImage', 'seoTitle', 'seoDescription'] as const;

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
      ...this.authorFields(dto),
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

  /** Public listing by default (published posts only); `manage` is the dashboard listing. */
  async findAll(
    query: BlogQueryDto,
    manage = false,
  ): Promise<{ data: BlogResponseDto[]; meta: PaginationMeta }> {
    const where = this.buildWhere(query);
    if (!manage) {
      // Public visitors only ever see published posts, whatever `status` they ask for.
      where.status = BlogStatusEnum.PUBLISHED;
    }
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

  /** Dashboard counters. */
  async getStats(): Promise<BlogStatsDto> {
    const staleWhere: Prisma.BlogWhereInput = {
      status: BlogStatusEnum.DRAFT,
      updatedAt: { lt: new Date(Date.now() - STALE_DRAFT_DAYS * 24 * 60 * 60 * 1000) },
    };
    const incompleteWhere: Prisma.BlogWhereInput = {
      status: BlogStatusEnum.PUBLISHED,
      OR: SEO_FIELDS.flatMap((field) => [{ [field]: null }, { [field]: '' }]),
    };
    const page = (where: Prisma.BlogWhereInput, orderBy: Prisma.BlogOrderByWithRelationInput) =>
      this.blogsRepository.findMany({ skip: 0, take: 5, where, orderBy });

    const [groups, featured, staleDrafts, stale, incomplete, incompleteBlogs, recent] =
      await Promise.all([
        this.blogsRepository.countByStatus(),
        this.blogsRepository.count({ isFeatured: true }),
        this.blogsRepository.count(staleWhere),
        page(staleWhere, { updatedAt: 'asc' }),
        this.blogsRepository.count(incompleteWhere),
        page(incompleteWhere, { publishedAt: 'desc' }),
        page({}, { updatedAt: 'desc' }),
      ]);
    const ref = ({ id, title, status, updatedAt }: Blog) => ({
      id,
      title,
      status: status,
      updatedAt,
    });

    return {
      ...toStatusCounts(Object.values(BlogStatusEnum), groups),
      featured,
      staleDrafts,
      staleDraftItems: stale.map(ref),
      incomplete,
      incompleteItems: incompleteBlogs.map((blog) => ({
        ...ref(blog),
        missing: SEO_FIELDS.filter((field) => !blog[field]),
      })),
      recent: recent.map(ref),
    };
  }

  // Public detail lookup: the website links blogs by slug, older links by id. Drafts are
  // reported as not found.
  async findOne(id: string): Promise<BlogResponseDto> {
    const blog = await this.blogsRepository.findByIdOrSlug(id);
    if (!blog || blog.status !== BlogStatusEnum.PUBLISHED) {
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
      ...this.authorFields(dto),
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

  // The DTO turns blank fields into null, so a blank clears the field (stored as NULL) and an
  // omitted one stays unchanged on update. Nothing is ever filled in for the author.
  private authorFields(dto: UpdateBlogDto) {
    return {
      authorName: dto.authorName,
      authorTitle: dto.authorTitle,
      authorBio: dto.authorBio,
      authorImage: dto.authorImage,
      authorLinkedin: dto.authorLinkedin,
    };
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
      await unlink(join(uploadsDir('blogs'), filename));
    } catch (error) {
      this.logger.warn(
        `Failed to delete featured image file "${filename}": ${(error as Error).message}`,
      );
    }
  }

  // Titles with no Latin letters or digits (e.g. Urdu) would otherwise slug to '' and give the post
  // an empty URL segment; generateUniqueSlug then numbers repeats (post, post-2, ...).
  private slugify(title: string): string {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || 'post';
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
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
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
