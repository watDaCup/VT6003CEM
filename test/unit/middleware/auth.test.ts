describe('basicAuth middleware', () => {
  const createCtx = (header?: string) => {
    return {
      headers: header ? { authorization: header } : {},
      status: 200,
      body: null,
      state: {}
    } as any;
  };

  const next = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 401 when Authorization header missing', async () => {
    const { basicAuth } = require('../../../src/middleware/auth');
    const ctx = createCtx();
    await basicAuth(ctx, next as any);
    expect(ctx.status).toBe(401);
    expect(ctx.body).toEqual({ message: 'Authentication required' });
  });

  it('returns 400 for invalid base64 header', async () => {
    const { basicAuth } = require('../../../src/middleware/auth');
    const ctx = createCtx('Basic invalid_base64');
    await basicAuth(ctx, next as any);
    expect(ctx.status).toBe(400);
    // Buffer.from with invalid base64 may decode to a string without ':' -> payload error
    expect(ctx.body).toEqual({ message: 'Bad authorization payload' });
  });

  it('returns 400 for malformed payload', async () => {
    const { basicAuth } = require('../../../src/middleware/auth');
    const b64 = Buffer.from('nousersep').toString('base64');
    const ctx = createCtx(`Basic ${b64}`);
    await basicAuth(ctx, next as any);
    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({ message: 'Bad authorization payload' });
  });

  it('returns 401 for unknown user', async () => {
    jest.resetModules();
    jest.doMock('../../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([])
    }));
    // require to pick up the mock
    const { basicAuth: ba } = require('../../../src/middleware/auth');
    const b64 = Buffer.from('nouser:pass').toString('base64');
    const ctx = createCtx(`Basic ${b64}`);
    await ba(ctx, next as any);
    expect(ctx.status).toBe(401);
    expect(ctx.body).toEqual({ message: 'Invalid credentials' });
  });

  it('authenticates valid user and calls next', async () => {
    jest.resetModules();
    jest.doMock('../../../src/model/users', () => ({
      findByUsername: jest.fn().mockResolvedValue([{ id: 2, username: 'u', password: 'p', role: 'User' }])
    }));
    const { basicAuth: ba } = require('../../../src/middleware/auth');
    const b64 = Buffer.from('u:p').toString('base64');
    const ctx = createCtx(`Basic ${b64}`);
    const nextFn = jest.fn(() => Promise.resolve());
    await ba(ctx, nextFn as any);
    expect(ctx.status).toBe(200);
    expect(ctx.state.user).toEqual({ id: 2, username: 'u', role: 'User' });
    expect(nextFn).toHaveBeenCalled();
  });
});
