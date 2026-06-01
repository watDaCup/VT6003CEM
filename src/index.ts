import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import serve from 'koa-static';
import path from 'path';
import { router as filmsRouter } from './routes/films';
import { router as usersRouter } from './routes/users';
import { router as messagesRouter } from './routes/messages';
import { errorHandler } from './controllers/errorHandler';

const app = new Koa();

app.use(errorHandler);
app.use(serve(path.join(__dirname,'/docs')));
app.use(serve(path.join(process.cwd(),'uploads')));
app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(filmsRouter.routes());
app.use(usersRouter.routes());
app.use(messagesRouter.routes());

const port = 10888;
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Koa started on ${port}`);
    });
}

export default app;