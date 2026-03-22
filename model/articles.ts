import  * as db  from '../helper/database';

export interface Article {
    title: string,
    fullText: string
}

export const articles = [

]

export const getAllArticles = async () => {
    let query = 'SELECT * FROM articles';
    let data = await db.run_query(query, null);
    return data;
}

export const getByIDArticles = async (id: any) => {
    let query = 'SELECT * FROM articles WHERE ID = ?';
    let data = await db.run_query(query, [id]);
    return data;
}

export const addNewArticle = async (article: any) => {
    let keys = Object.keys(article);
    let values = Object.values(article);
    let key = keys.join(',');
    let param = '';
    for(let i:number = 0; i<values.length; i++) { param += '?,'}
    param = param.slice(0,-1);
    let query = `INSERT INTO articles (${key}) VALUES (${param})`;
    try {
        let msg = await db.run_insert(query, values);
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

    let keys = Object.keys(fieldsToUpdate);
    let values = Object.values(fieldsToUpdate);
    let setClause = keys.map(k => `${k} = ?`).join(',');
    let params = [...values, ID];

    let query = `UPDATE articles SET ${setClause} WHERE id = ?`;
    try {
        let msg = await db.run_update(query, params);
        return { status: 201, msg: msg}
    } catch (err: any) {
        return err;
    }
}

export const deleteArticleById = async (id: any) => {
    let query = `DELETE FROM articles WHERE ID = ?`;
    try {
        let msg = await db.run_update(query, [id]);
        return { status: 200, msg: msg}
    } catch (err: any) {
        return err;
    }
}