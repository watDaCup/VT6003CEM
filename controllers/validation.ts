import { Validator, ValidationError } from 'jsonschema';
import { RouterContext } from 'koa-router';
import { article } from '../schemas/article.schema';

const v = new Validator()

export const validateArticle = async (ctx: RouterContext, next: any) => {
    const validateOptions = {
        throwError: true,
        allowUnknownAttribute: false
    }
    const body = ctx.request.body;
    try {
        v.validate(body, article, validateOptions);
        await next();
    } catch (error) {
        if (error instanceof ValidationError) {
            ctx.body = error;
            ctx.status = 400;
        } else {
            throw error;
        }
    }
}