import { Context, Next } from 'koa';

export const requireRole = (roles: Array<string>) => {
    return async (ctx: Context, next: Next) => {
        const user = ctx.state.user;
        if (!user) {
            ctx.status = 401;
            ctx.body = { message: 'Authentication required' };
            return;
        }
        if (!roles.includes(user.role)) {
            ctx.status = 403;
            ctx.body = { message: 'Forbidden: insufficient role' };
            return;
        }
        await next();
    }
}
