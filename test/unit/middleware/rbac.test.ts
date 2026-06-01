import { requireRole } from '../../../src/middleware/rbac';

describe('requireRole middleware', () => {
  const next = jest.fn(() => Promise.resolve());

  it('returns 401 when user is missing', async () => {
    const ctx: any = { state: {} };
    await requireRole(['Admin'])(ctx, next as any);
    expect(ctx.status).toBe(401);
    expect(ctx.body).toEqual({ message: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when role is not allowed', async () => {
    const ctx: any = { state: { user: { role: 'User' } } };
    await requireRole(['Admin'])(ctx, next as any);
    expect(ctx.status).toBe(403);
    expect(ctx.body).toEqual({ message: 'Forbidden: insufficient role' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when role is allowed', async () => {
    const ctx: any = { state: { user: { role: 'Admin' } } };
    await requireRole(['Admin'])(ctx, next as any);
    expect(next).toHaveBeenCalled();
  });
});
