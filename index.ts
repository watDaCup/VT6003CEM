import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import Router, { RouterContext } from 'koa-router';
import { router as articleRouter } from './routes/articles';

const app: Koa = new Koa();
const router: Router = new Router();

// router.get('/', async(ctx: RouterContext, next: any) => {
//     ctx.body = { msg: 'Hello World' };
//     await next();
// })

// router.post('/', async(ctx: RouterContext, next: any) => {
//     const data = ctx.request.body;
//     ctx.body = data;
//     await next();
// })

const welcomeAPI = async (ctx: RouterContext, next: any) => {
    ctx.body = {
        msg: "Welcome to the blog API"
    };
    await next();
}

router.get('/api/v1', welcomeAPI);
// articleRouter.get('/api/v1', welcomeAPI);

app.use(json());
app.use(logger());
app.use(bodyParser())
// app.use(router.routes());
// app.use(router.allowedMethods());
app.use(articleRouter.routes());
app.use(articleRouter.allowedMethods());

app.use(async (ctx: RouterContext, next: any) => {
    try{
        await next();
        // if(ctx.status === 404){
        //     ctx.status = 404;
        //     ctx.body = { err: "No such endpoint existed"};
        // }
    }catch(err: any){
        ctx.body = { err: err};
    }       
})

app.listen(10888, () => {
    console.log('Koa started');
});
