import { errorHandler } from '../../../src/controllers/errorHandler';

describe('errorHandler middleware', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('catches thrown errors and sets status 500', async () => {
    const ctx: any = {};
    const next = jest.fn(() => { throw new Error('boom'); });
    await errorHandler(ctx, next as any);
    expect(ctx.status).toBe(500);
    expect(ctx.body).toEqual({ error: { message: 'boom' } });
  });

  it('uses error.status when provided', async () => {
    const ctx: any = {};
    const next = jest.fn(() => {
      const err: any = new Error('validation');
      err.status = 400;
      throw err;
    });
    await errorHandler(ctx, next as any);
    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({ error: { message: 'validation' } });
  });

  it('does nothing when no error is thrown', async () => {
    const ctx: any = { body: null, status: 200 };
    const next = jest.fn(() => Promise.resolve());
    await errorHandler(ctx, next as any);
    expect(ctx.body).toBeNull();
    expect(ctx.status).toBe(200);
  });
});
