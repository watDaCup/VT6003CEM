import * as db from '../helper/database';
import { User } from '../types/types';

export const findByUsername = async (username: string) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const user = await db.run_query(query, [username]);
    return user;
}

export const createUser = async (u: User) => {
    const sql = `INSERT INTO users (username, password, role, email, profile_photo) VALUES (?,?,?,?,?)`;
    const res = await db.run_insert(sql, [u.username, u.password, u.role || 'User', u.email || null, u.profile_photo || null]);
    return res;
}

export const getById = async (id: number) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await db.run_query(sql, [id]);
}

export const updateProfilePhoto = async (id: number, path: string) => {
    const sql = 'UPDATE users SET profile_photo = ? WHERE id = ?';
    return await db.run_update(sql, [path, id]);
}

export const getAdminUser = async () => {
    const sql = "SELECT * FROM users WHERE role = 'Admin' LIMIT 1";
    const r = await db.run_query(sql, []);
    return r[0];
}
