import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import serve from 'koa-static';
import Router, { RouterContext } from 'koa-router';
import { router as articleRouter } from './routes/articles';
import { router as userRouter } from './routes/special';
import path from 'path';

const app: Koa = new Koa();


// const welcomeAPI = async (ctx: RouterContext, next: any) => {
//     ctx.body = {
//         msg: "Welcome to the blog API"
//     };
//     await next();
// }

app.use(serve(path.join(__dirname,'/docs')));
app.use(json());
app.use(logger());
app.use(bodyParser());
//app.use(userRouter.routes());
app.use(articleRouter.routes());
    
app.listen(10888, () => {
    console.log('Koa started');
});
