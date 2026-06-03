import Router from 'koa-router';
import { Context } from 'koa';
import * as model from '../model/films';
import { basicAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = new Router({ prefix: '/api/v1/films' });

router.get('/', async (ctx: Context) => {
    const filters = ctx.request.query;
    const films = await model.getAllFilms(filters);
    ctx.body = films;
});

router.get('/:id', async (ctx: Context) => {
    const id = Number(ctx.params.id);
    const f = await model.getFilmById(id);
    if (!f || !f.length) { ctx.status = 404; ctx.body = { message: 'Not found' }; return; }
    ctx.body = f[0];
});

// Admin-only create/update/delete
router.post('/', basicAuth, requireRole(['Admin']), async (ctx: Context) => {
    const body = ctx.request.body as any;
    console.log('Creating film with data:', body);
    const res = await model.addFilm(body);
    ctx.status = 201;
    ctx.body = { message: 'Film created', result: res };
});

router.put('/:id', basicAuth, requireRole(['Admin']), async (ctx: Context) => {
    const id = Number(ctx.params.id);
    console.log('Updating film with ID:', id);
    const res = await model.updateFilm(id, ctx.request.body as any);
    ctx.body = { message: 'Film updated', result: res };
});

router.delete('/:id', basicAuth, requireRole(['Admin']), async (ctx: Context) => {
    const id = Number(ctx.params.id);
    await model.deleteFilm(id);
    ctx.body = { message: 'Film deleted' };
});

export { router };
