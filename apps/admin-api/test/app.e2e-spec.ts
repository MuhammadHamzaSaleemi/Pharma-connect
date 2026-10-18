import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

// Boots the real AppModule (config validation, guards, routing) with Prisma stubbed out, so it runs
// without a database. Only requests that never reach the database are exercised here.
process.env['DATABASE_URL'] ??= 'postgresql://test:test@localhost:5432/test';
process.env['JWT_SECRET'] ??= 'e2e-access-secret-at-least-32-characters';
process.env['JWT_REFRESH_SECRET'] ??= 'e2e-refresh-secret-at-least-32-characters';

describe('admin-api (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const { AppModule } = await import('../src/app.module');
    const { PrismaService } = await import('../src/database/prisma.service');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health is public', () => {
    return request(app.getHttpServer()).get('/api/v1/health').expect(200);
  });

  it.each([
    ['get', '/api/v1/users'],
    ['get', '/api/v1/jobs/manage'],
    ['get', '/api/v1/blogs/manage'],
    ['get', '/api/v1/scholarships/manage'],
    ['post', '/api/v1/uploads/image'],
    ['post', '/api/v1/jobs'],
  ] as const)('%s %s requires a signed-in user', (method, path) => {
    return request(app.getHttpServer())[method](path).expect(401);
  });
});
