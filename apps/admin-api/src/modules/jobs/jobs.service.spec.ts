import { NotFoundException } from '@nestjs/common';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { UserStatusEnum } from '../../common/enums/user-status.enum';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { JobsService } from './jobs.service';
import type { JobsRepository } from './repositories/jobs.repository';
import { JobTransformer } from './transformers/job.transformer';

// @nestjs/schedule ships ESM that this Jest config doesn't transform; the cron isn't under test.
jest.mock('@nestjs/schedule', () => ({
  Cron: () => () => undefined,
  CronExpression: { EVERY_DAY_AT_MIDNIGHT: '0 0 * * *' },
}));

const actor = (id: string, role: UserRoleEnum): AuthenticatedUser => ({
  id,
  name: id,
  email: `${id}@x.com`,
  role,
  status: UserStatusEnum.ACTIVE,
});
const adminA = actor('admin-a', UserRoleEnum.ADMIN);
const superAdmin = actor('super', UserRoleEnum.SUPER_ADMIN);

function makeService(job: object | null = null) {
  const repo = {
    findById: jest.fn().mockResolvedValue(job),
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
    countByStatus: jest.fn().mockResolvedValue([]),
    findForBreakdown: jest.fn().mockResolvedValue([]),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return {
    repo,
    service: new JobsService(repo as unknown as JobsRepository, new JobTransformer()),
  };
}

const query = { page: 1, limit: 10 } as never;
const whereOf = (repo: ReturnType<typeof makeService>['repo']) =>
  (repo.findMany.mock.calls[0] as [{ where: Record<string, unknown> }])[0].where;

describe('JobsService ownership', () => {
  it('limits the public listing to ACTIVE jobs, whatever status is requested', async () => {
    const { service, repo } = makeService();
    await service.findAll({ page: 1, limit: 10, status: 'DRAFT' } as never);
    expect(whereOf(repo).status).toBe('ACTIVE');
  });

  it('does not scope a SUPER_ADMIN, an ADMIN or the public listing', async () => {
    for (const who of [superAdmin, adminA, undefined]) {
      const { service, repo } = makeService();
      await service.findAll(query, who);
      expect(whereOf(repo).createdById).toBeUndefined();
    }
  });

  it("lets a SUPER_ADMIN or an ADMIN delete any job, including another's or unowned ones", async () => {
    for (const createdById of ['admin-b', null]) {
      for (const who of [superAdmin, adminA]) {
        const { service, repo } = makeService({ id: 'j1', createdById });
        await service.remove(who, 'j1');
        expect(repo.delete).toHaveBeenCalledWith('j1');
      }
    }
  });

  it('reports a missing job as not found', async () => {
    const { service, repo } = makeService(null);
    await expect(service.remove(adminA, 'j1')).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});

describe('JobsService stats', () => {
  it('counts every job for an ADMIN and fills in missing statuses with 0', async () => {
    const { service, repo } = makeService();
    repo.countByStatus.mockResolvedValue([
      { status: 'ACTIVE', _count: { _all: 3 } },
      { status: 'DRAFT', _count: { _all: 2 } },
    ]);
    repo.count.mockResolvedValue(1);

    const stats = await service.getStats(adminA);

    expect(repo.countByStatus).toHaveBeenCalledWith({});
    const [expiringWhere] = repo.count.mock.calls[0] as [
      { createdById?: string; createdAt: { lte: Date } },
    ];
    expect(expiringWhere.createdById).toBeUndefined();
    // 14 days back: 7 days before the 21-day cleanup deletes the job.
    const daysBack = (Date.now() - expiringWhere.createdAt.lte.getTime()) / 86_400_000;
    expect(Math.round(daysBack)).toBe(14);
    expect(stats).toMatchObject({
      total: 5,
      byStatus: { ACTIVE: 3, DRAFT: 2, INACTIVE: 0, CLOSED: 0 },
      expiringSoon: 1,
    });
    expect(stats.byOwner).toEqual([]);
  });

  it('breaks down only active jobs, and adds per-owner counts for a SUPER_ADMIN', async () => {
    const { service, repo } = makeService();
    const row = (status: string, city: string, owner: string | null) => ({
      status,
      sector: 'PRODUCTION',
      workType: 'REMOTE',
      city,
      createdBy: owner ? { name: owner } : null,
    });
    repo.findForBreakdown.mockResolvedValue([
      row('ACTIVE', 'Lahore', 'Ali'),
      row('ACTIVE', 'Lahore', 'Ali'),
      row('ACTIVE', 'Karachi', null),
      row('DRAFT', 'Quetta', 'Sara'),
    ]);

    const stats = await service.getStats(superAdmin);

    expect(stats.topCities).toEqual([
      { label: 'Lahore', count: 2 },
      { label: 'Karachi', count: 1 },
    ]);
    expect(stats.bySector).toEqual([{ label: 'PRODUCTION', count: 3 }]);
    expect(stats.byOwner).toEqual([
      { label: 'Ali', count: 2 },
      { label: 'Sara', count: 1 },
      { label: 'Unassigned', count: 1 },
    ]);
  });
});
