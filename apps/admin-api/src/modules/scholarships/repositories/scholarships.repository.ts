import { Injectable } from '@nestjs/common';
import { Prisma, type Scholarship } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

interface FindManyParams {
  skip: number;
  take: number;
  where: Prisma.ScholarshipWhereInput;
  orderBy: Prisma.ScholarshipOrderByWithRelationInput;
}

@Injectable()
export class ScholarshipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ScholarshipCreateInput): Promise<Scholarship> {
    return this.prisma.scholarship.create({ data });
  }

  async findById(id: string): Promise<Scholarship | null> {
    return this.prisma.scholarship.findUnique({ where: { id } });
  }

  async findMany(params: FindManyParams): Promise<Scholarship[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.scholarship.findMany({ skip, take, where, orderBy });
  }

  async count(where: Prisma.ScholarshipWhereInput): Promise<number> {
    return this.prisma.scholarship.count({ where });
  }

  async update(id: string, data: Prisma.ScholarshipUpdateInput): Promise<Scholarship> {
    return this.prisma.scholarship.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Scholarship> {
    return this.prisma.scholarship.delete({ where: { id } });
  }
}
