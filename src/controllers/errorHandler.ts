import { Context, Next } from 'koa';

export const errorHandler = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err: any) {
        console.error('Unhandled error:', err);
        ctx.status = err.status || 500;
        ctx.body = {
            error: {
                message: err.message || 'Internal Server Error'
            }
        };
    }
}
