import { NotFoundException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { BlogStatusEnum } from '../../common/enums/blogs/blog-status.enum';
import { BlogsService } from './blogs.service';
import type { BlogsRepository } from './repositories/blogs.repository';
import { BlogTransformer } from './transformers/blog.transformer';

function makeService(blog: object | null = null) {
  const repo = {
    findByIdOrSlug: jest.fn().mockResolvedValue(blog),
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
  };
  return {
    repo,
    service: new BlogsService(
      repo as unknown as BlogsRepository,
      new BlogTransformer(),
      {} as ConfigService,
    ),
  };
}

const whereOf = (repo: ReturnType<typeof makeService>['repo']) =>
  (repo.findMany.mock.calls[0] as [{ where: Record<string, unknown> }])[0].where;

describe('BlogsService visibility', () => {
  it('limits the public listing to published posts, whatever status is requested', async () => {
    const { service, repo } = makeService();
    await service.findAll({ page: 1, limit: 10, status: BlogStatusEnum.DRAFT } as never);
    expect(whereOf(repo).status).toBe(BlogStatusEnum.PUBLISHED);
  });

  it('lets the dashboard listing filter by any status', async () => {
    const { service, repo } = makeService();
    await service.findAll({ page: 1, limit: 10, status: BlogStatusEnum.DRAFT } as never, true);
    expect(whereOf(repo).status).toBe(BlogStatusEnum.DRAFT);
  });

  it('reports a draft as not found on the public detail endpoint', async () => {
    const { service } = makeService({ id: 'b1', slug: 'draft', status: 'DRAFT' });
    await expect(service.findOne('draft')).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('BlogsService slugs', () => {
  it('falls back to "post" for titles with no Latin letters or digits', async () => {
    const repo = {
      existsBySlug: jest.fn().mockResolvedValueOnce(true).mockResolvedValue(false),
      create: jest.fn((data: { slug: string }) => Promise.resolve({ ...data, id: 'b1', tags: [] })),
    };
    const service = new BlogsService(
      repo as unknown as BlogsRepository,
      new BlogTransformer(),
      {} as ConfigService,
    );
    const blog = await service.create({ title: 'فارمیسی کیریئر', content: '<p>x</p>' });
    expect(blog.slug).toBe('post-2');
  });
});
