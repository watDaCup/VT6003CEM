import { Context, Next } from 'koa';
import { findByUsername } from '../model/users';

// Basic auth parser without external passport, attaches user to ctx.state.user
export const basicAuth = async (ctx: Context, next: Next) => {
    const header = ctx.headers['authorization'];
    if (!header || !header.startsWith('Basic ')) {
        ctx.status = 401;
        ctx.body = { message: 'Authentication required' };
        return;
    }
    const b64 = header.slice(6);
    let decoded = '';
    try {
        decoded = Buffer.from(b64, 'base64').toString('utf8');
    } catch (e) {
        ctx.status = 400;
        ctx.body = { message: 'Bad authorization header' };
        return;
    }
    const [username, password] = decoded.split(':');
    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { message: 'Bad authorization payload' };
        return;
    }
    try {
        const res: any = await findByUsername(username);
        if (!res || !res.length) {
            ctx.status = 401;
            ctx.body = { message: 'Invalid credentials' };
            return;
        }
        const user = res[0];
        // No hashing as per brief
        if (user.password !== password) {
            ctx.status = 401;
            ctx.body = { message: 'Invalid credentials' };
            return;
        }
        ctx.state.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        await next();
    } catch (err: any) {
        // console.error("[DEBUG - Database/Auth Middleware Exception Caught]:", err);
        ctx.status = 500;
        ctx.body = { message: 'Auth error'};
    }
}
