import { Injectable } from '@nestjs/common';
import { Prisma, type Job } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

interface FindManyParams {
  skip: number;
  take: number;
  where: Prisma.JobWhereInput;
  orderBy: Prisma.JobOrderByWithRelationInput;
}

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.JobCreateInput): Promise<Job> {
    return this.prisma.job.create({ data });
  }

  async findById(id: string): Promise<Job | null> {
    return this.prisma.job.findUnique({ where: { id } });
  }

  async findMany(params: FindManyParams): Promise<Job[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.job.findMany({ skip, take, where, orderBy });
  }

  async count(where: Prisma.JobWhereInput): Promise<number> {
    return this.prisma.job.count({ where });
  }

  async update(id: string, data: Prisma.JobUpdateInput): Promise<Job> {
    return this.prisma.job.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Job> {
    return this.prisma.job.delete({ where: { id } });
  }
}
