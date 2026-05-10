import  * as db  from '../helper/database';

export interface Article {
    title: string,
    fullText: string
}

export const articles = [

]

export const getAllArticles = async () => {
    const query = 'SELECT * FROM articles';
    const data = await db.run_query(query, null);
    return data;
}

export const getByIDArticles = async (id: any) => {
    const query = 'SELECT * FROM articles WHERE ID = ?';
    const data = await db.run_query(query, [id]);
    return data;
}

export const addNewArticle = async (article: any) => {
    const keys = Object.keys(article);
    const values = Object.values(article);
    const key = keys.join(',');
    let param = '';
    for(let i:number = 0; i<values.length; i++) { param += '?,'}
    param = param.slice(0,-1);
    const query = `INSERT INTO articles (${key}) VALUES (${param})`;
    try {
        const msg = await db.run_insert(query, values);
        return { status: 201, msg: msg}
    } catch (err: any) {
        return err;
    }
}

export const updateArticleById = async (article: any) => {
    const { ID, ...fieldsToUpdate} = article;

    if (!ID) {
        return { status: 400, msg: 'Missing \'ID\' field in request body'}
    }

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
    const setClause = keys.map(k => `${k} = ?`).join(',');
    const params = [...values, ID];

    const query = `UPDATE articles SET ${setClause} WHERE id = ?`;
    try {
        const msg = await db.run_update(query, params);
        return { status: 201, msg: msg}
    } catch (err: any) {
        return err;
    }
}

export const deleteArticleById = async (id: any) => {
    const query = `DELETE FROM articles WHERE ID = ?`;
    try {
        const msg = await db.run_update(query, [id]);
        return { status: 200, msg: msg}
    } catch (err: any) {
        return err;
    }
}