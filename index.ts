import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import Router, { RouterContext } from 'koa-router';

const app: Koa = new Koa();
const router: Router = new Router();

router.get('/', async(ctx: RouterContext, next: any) => {
    ctx.body = { msg: 'Hello World' };
    await next();
})

router.post('/', async(ctx: RouterContext, next: any) => {
    const data = ctx.request.body;
    ctx.body = data;
    await next();
})

app.use(json());
app.use(logger());
app.use(bodyParser())
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(10888, () => {
    console.log('Koa started');
});