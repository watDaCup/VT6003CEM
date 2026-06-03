import Router from 'koa-router';
import { Context } from 'koa';
import * as model from '../model/users';
import { basicAuth } from '../middleware/auth';
import * as favModel from '../model/favorites';

const router = new Router({ prefix: '/api/v1/users' });

router.post('/', async (ctx: Context) => {
    // signup
    const body = ctx.request.body as any;
    const res = await model.createUser(body);
    ctx.status = 201;
    ctx.body = { message: 'User created', result: res };
});

router.post('/login', basicAuth, async (ctx: Context) => {
    // basicAuth attached user to ctx.state.user
    ctx.body = { message: 'Authenticated', user: ctx.state.user };
});

// Upload profile photo as base64 JSON
router.post('/:id/photo', basicAuth, async (ctx: Context) => {
    const id = Number(ctx.params.id);
    if (ctx.state.user.id !== id && ctx.state.user.role !== 'Admin') {
        ctx.status = 403; 
        ctx.body = { message: 'Forbidden' }; 
        return;
    }
    const { data } = (ctx.request.body as { data?: string }) || {};
    if (!data) { 
        ctx.status = 400; 
        ctx.body = { message: 'filename and data required' }; 
        return; 
    }
    await model.updateProfilePhoto(id, data);
    ctx.body = { message: 'Photo uploaded', data: data };
});

// Favorites
router.post('/:id/favorites/:filmId', basicAuth, async (ctx: Context) => {
    const id = Number(ctx.params.id);
    const filmId = Number(ctx.params.filmId);
    if (ctx.state.user.id !== id) { ctx.status = 403; return; }
    await favModel.addFavorite(id, filmId);
    ctx.body = { message: 'Added to favorites' };
});

router.delete('/:id/favorites/:filmId', basicAuth, async (ctx: Context) => {
    const id = Number(ctx.params.id);
    const filmId = Number(ctx.params.filmId);
    if (ctx.state.user.id !== id) { ctx.status = 403; return; }
    await favModel.removeFavorite(id, filmId);
    ctx.body = { message: 'Removed from favorites' };
});

router.get('/:id/favorites', basicAuth, async (ctx: Context) => {
    const id = Number(ctx.params.id);
    if (ctx.state.user.id !== id && ctx.state.user.role !== 'Admin') { ctx.status = 403; return; }
    const list = await favModel.listFavorites(id);
    ctx.body = list;
});

export { router };
