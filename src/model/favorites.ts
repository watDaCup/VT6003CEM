import * as db from '../helper/database';

export const addFavorite = async (userId: number, filmId: number) => {
    const sql = 'INSERT INTO favorites (user_id, film_id) VALUES (?,?)';
    return await db.run_insert(sql, [userId, filmId]);
}

export const removeFavorite = async (userId: number, filmId: number) => {
    const sql = 'DELETE FROM favorites WHERE user_id = ? AND film_id = ?';
    return await db.run_update(sql, [userId, filmId]);
}

export const listFavorites = async (userId: number) => {
    const sql = `SELECT f.* FROM films f JOIN favorites fav ON fav.film_id = f.id WHERE fav.user_id = ?`;
    return await db.run_query(sql, [userId]);
}
