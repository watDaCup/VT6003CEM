import bodyParser from "koa-bodyparser";
import Router, { type RouterContext } from "koa-router";
import * as model from '../model/articles';
import { updateArticleById } from '../model/articles';
import { basicAuth } from "../controllers/auth";
import { validateArticle } from "../controllers/validation";

const router = new Router({prefix: '/api/v1/articles'});

const articles = [
    {title: 'hello article', fullText: 'some text here to fill the body'},
    {title: 'another article', fullText: 'some text here to fill another body'},
    {title: 'more article', fullText: 'some text here to fill more body'},
    {title: 'last article', fullText: 'some text here to fill the last body'},
]

const getAll = async (ctx: RouterContext, next: any) =>{
    const articles = await model.getAllArticles();
    if(articles.length) {
        ctx.body = articles;
    } else {
        ctx.body = {};
    }
    await next();
}

const getById = async (ctx: RouterContext, next: any) =>{
    const id = ctx.params.id;
    const articles = await model.getByIDArticles(id);
    if(articles.length) {
        ctx.body = articles;
    } else {
        ctx.status = 404;
        ctx.body = {msg: 'Article not found'}
    }
    await next();
}


const createArticle = async (ctx: RouterContext, next: any) =>{
    const body = ctx.request.body;
    const result = await model.addNewArticle(body)
    if(result.status == 201) {
        ctx.body = articles;
    } else {
        ctx.status = 404;
        ctx.body = {msg: 'Create failed'};
    }
    await next();
}


const updateArticle = async (ctx: RouterContext, next: any) =>{
    const body = ctx.request.body;
    const result = await model.updateArticleById(body)
    if(result.status == 201) {
        ctx.body = articles;
    } else {
        ctx.status = 404;
        ctx.body = {msg: 'Create failed'};
    }
    await next();
}


const deleteArticle = async (ctx: RouterContext, next: any) =>{
    const id = ctx.params.id;
    const result = await model.deleteArticleById(id)
    if (result) {
        ctx.body = {msg: 'Article deleted'};
    } else {
        ctx.status = 404;
        ctx.body = {msg: 'Article not found'};
    }
    await next();
}

router.get('/', getAll);
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.get('/:id', getById);
router.put('/:id', basicAuth, bodyParser(), validateArticle, updateArticle);
router.del('/:id', deleteArticle);

// console.log('Registered Routes:');
// router.stack.forEach((layer) => {
//     console.log(`${layer.methods.join(', ')} ${layer.path}`);
// });

export{ router }