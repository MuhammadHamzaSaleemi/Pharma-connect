import { Logger, NotFoundException, type ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllExceptionsFilter } from './all-exceptions.filter';

function run(exception: unknown): { status?: number; body?: { message: string } } {
  const json = jest.fn<void, [{ message: string }]>();
  const response = { status: jest.fn<{ json: typeof json }, [number]>(() => ({ json })) };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => ({ method: 'POST', url: '/api/v1/users' }),
    }),
  } as unknown as ArgumentsHost;
  new AllExceptionsFilter().catch(exception, host);
  return { status: response.status.mock.calls[0]?.[0], body: json.mock.calls[0]?.[0] };
}

const prismaError = (code: string, meta?: Record<string, unknown>) =>
  new Prisma.PrismaClientKnownRequestError('db error', { code, clientVersion: 'test', meta });

describe('AllExceptionsFilter', () => {
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  it('turns a unique-constraint race into 409', () => {
    const { status, body } = run(prismaError('P2002', { target: ['email'] }));
    expect(status).toBe(409);
    expect(body?.message).toBe('A record with this email already exists');
  });

  it('turns a missing record into 404', () => {
    expect(run(prismaError('P2025')).status).toBe(404);
  });

  it('keeps HttpException statuses and hides unknown errors behind a 500', () => {
    expect(run(new NotFoundException('nope')).status).toBe(404);
    const { status, body } = run(new Error('secret internals'));
    expect(status).toBe(500);
    expect(body?.message).toBe('Internal server error');
  });
});
