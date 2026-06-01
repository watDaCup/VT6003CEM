import * as db from '../helper/database';
import { Film } from '../types/types';

export const getAllFilms = async (filters?: any) => {
    let sql = 'SELECT * FROM films';
    const where: string[] = [];
    const values: any[] = [];
    if (filters) {
        if (filters.title) { where.push('title LIKE ?'); values.push(`%${filters.title}%`); }
        if (filters.genre) { where.push('genre = ?'); values.push(filters.genre); }
        if (filters.year) { where.push('year = ?'); values.push(filters.year); }
        if (filters.rating) { where.push('rating >= ?'); values.push(filters.rating); }
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    return await db.run_query(sql, values);
}

export const getFilmById = async (id: number) => {
    const sql = 'SELECT * FROM films WHERE id = ?';
    return await db.run_query(sql, [id]);
}

export const addFilm = async (f: Film) => {
    const sql = 'INSERT INTO films (title, genre, year, rating, description) VALUES (?,?,?,?,?)';
    return await db.run_insert(sql, [f.title, f.genre || null, f.year || null, f.rating || null, f.description || null]);
}

export const updateFilm = async (id: number, f: Partial<Film>) => {
    const fields: string[] = [];
    const values: any[] = [];
    if (f.title !== undefined) { fields.push('title = ?'); values.push(f.title); }
    if (f.genre !== undefined) { fields.push('genre = ?'); values.push(f.genre); }
    if (f.year !== undefined) { fields.push('year = ?'); values.push(f.year); }
    if (f.rating !== undefined) { fields.push('rating = ?'); values.push(f.rating); }
    if (f.description !== undefined) { fields.push('description = ?'); values.push(f.description); }
    if (!fields.length) return null;
    const sql = `UPDATE films SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    return await db.run_update(sql, values);
}

export const deleteFilm = async (id: number) => {
    const sql = 'DELETE FROM films WHERE id = ?';
    return await db.run_update(sql, [id]);
}
