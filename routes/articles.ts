import bodyParser from "koa-bodyparser";
import Router, { type RouterContext } from "koa-router"

const router = new Router({prefix: '/api/v1/articles'})

const articles = [
    {title: 'hello article', fullText: 'some text here to fill the body'},
    {title: 'another article', fullText: 'some text here to fill another body'},
    {title: 'more article', fullText: 'some text here to fill more body'},
    {title: 'last article', fullText: 'some text here to fill the last body'},
]

const getAll = async (ctx: RouterContext, next: any) =>{
    ctx.body = articles;
    await next();
}

const getById = async (ctx: RouterContext, next: any) =>{
    let id = +ctx.params.id!;
    if ((id < articles.length + 1) && (id > 0)) {
        ctx.body = articles[id - 1];
    } else {
        ctx.status = 404;
        ctx.body = {msg: 'Article not found '}
    }
    await next();
}


const createArticle = async (ctx: RouterContext, next: any) =>{
    let {title, fullText}: any = ctx.request.body;
    let newArticle = {title: title, fullText: fullText};
    articles.push(newArticle);
    ctx.status = 201;
    ctx.body = newArticle;
    await next();
}


const updateArticle = async (ctx: RouterContext, next: any) =>{
    let id = +ctx.params.id!
    let { title, fullText }: any = ctx.request.body;
    let updateArticle = { title: title, fullText: fullText};
    if ((id < articles.length + 1) && (id > 0)) {
        articles[id -1] = updateArticle;
    } else {
        ctx.status = 404;
        ctx.body = {msg: 'Article not found'};
    }
    await next();
}


const deleteArticle = async (ctx: RouterContext, next: any) =>{
    let id = +ctx.params.id!
    if ((id < articles.length + 1) && (id > 0)) {
        articles.splice(id, 1)
    } else {
        ctx.status = 404;
        ctx.body = {msg: 'Article not found'};
    }
    await next();
}

router.get('/', getAll);
router.post('/', bodyParser(), createArticle);
router.get('/:id', getById);
router.put('/:id', updateArticle);
router.del('/:id', deleteArticle);

console.log('Registered Routes:');
router.stack.forEach((layer) => {
    console.log(`${layer.methods.join(', ')} ${layer.path}`);
});

export{ router }