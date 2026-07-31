import { Injectable } from '@nestjs/common';
import { Prisma, type Blog } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

interface FindManyParams {
  skip: number;
  take: number;
  where: Prisma.BlogWhereInput;
  orderBy: Prisma.BlogOrderByWithRelationInput;
}

@Injectable()
export class BlogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BlogCreateInput): Promise<Blog> {
    return this.prisma.blog.create({ data });
  }

  async findById(id: string): Promise<Blog | null> {
    return this.prisma.blog.findUnique({ where: { id } });
  }

  async findMany(params: FindManyParams): Promise<Blog[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.blog.findMany({ skip, take, where, orderBy });
  }

  async count(where: Prisma.BlogWhereInput): Promise<number> {
    return this.prisma.blog.count({ where });
  }

  async update(id: string, data: Prisma.BlogUpdateInput): Promise<Blog> {
    return this.prisma.blog.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Blog> {
    return this.prisma.blog.delete({ where: { id } });
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await this.prisma.blog.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    return existing !== null;
  }
}
