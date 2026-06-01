import Router from 'koa-router';
import { Context } from 'koa';
import * as msgModel from '../model/messages';
import * as usersModel from '../model/users';
import { basicAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = new Router({ prefix: '/api/v1/messages' });

// Registered users send messages to admin
router.post('/', basicAuth, requireRole(['User','Admin']), async (ctx: Context) => {
    const body = ctx.request.body as { film_id?: number; text: string };
    const from_user_id = ctx.state.user.id;
    const admin = await usersModel.getAdminUser() as { id: number };
    if(!admin) { ctx.status = 500; ctx.body = { message: 'No admin configured' }; return; }
    const m = {
        from_user_id,
        to_user_id: admin.id,
        film_id: body.film_id || null,
        text: body.text
    };
    const res = await msgModel.sendMessage(m as any);
    ctx.status = 201; ctx.body = { message: 'Message sent', result: res };
});

// Admin views all messages
router.get('/', basicAuth, requireRole(['Admin']), async (ctx: Context) => {
    const list = await msgModel.getMessagesForAdmin();
    ctx.body = list;
});

// Respond to a message
router.post('/:id/respond', basicAuth, requireRole(['Admin']), async (ctx: Context) => {
    const id = Number(ctx.params.id);
    const { response } = ctx.request.body as { response: string };
    await msgModel.respondToMessage(id, response);
    ctx.body = { message: 'Responded' };
});

// Delete (either side or admin)
router.del('/:id', basicAuth, requireRole(['Admin']), async (ctx: Context) => {
    const id = Number(ctx.params.id);
    await msgModel.deleteMessage(id);
    ctx.body = { message: 'Message deleted' };
});

export { router };
