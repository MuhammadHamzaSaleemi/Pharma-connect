import { Injectable } from '@nestjs/common';
import { Prisma, ScholarshipStatus, type Scholarship } from '@prisma/client';
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

  async countByStatus() {
    return this.prisma.scholarship.groupBy({ by: ['status'], _count: { _all: true } });
  }

  async findCountries(where: Prisma.ScholarshipWhereInput) {
    return this.prisma.scholarship.findMany({ where, select: { country: true } });
  }

  async expirePastDeadline(now: Date): Promise<number> {
    const result = await this.prisma.scholarship.updateMany({
      where: { status: ScholarshipStatus.ACTIVE, endDate: { lt: now } },
      data: { status: ScholarshipStatus.EXPIRED },
    });
    return result.count;
  }

  async update(id: string, data: Prisma.ScholarshipUpdateInput): Promise<Scholarship> {
    return this.prisma.scholarship.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Scholarship> {
    return this.prisma.scholarship.delete({ where: { id } });
  }
}
