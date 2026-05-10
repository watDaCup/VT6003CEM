import Koa from "koa";
import json from "koa-json";
import passport from 'koa-passport';
import { router } from '../../src/routes/articles';
import request from 'supertest';

const app: Koa = new Koa();

app.use(json());
app.use(passport.initialize());
app.use(router.middleware());

app.listen(3000);

describe('Get / - a simple api endpoint', () => {
    test('Get all article', async () => {
        const result = await
            request(app.callback()).get('/api/v1/articles');
        expect(result.statusCode).toEqual(200);
    })
})

describe('Post / - a simple api endpoint', () => {
    xtest('Post an article', async () => {
        const result =
            await request(app.callback()).post('/api/v1/articles')
                    .set({'authorization': atob('alice:1234567890')});
        expect(result.statusCode).toEqual(201);
    })
})