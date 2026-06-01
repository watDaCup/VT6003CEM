import * as db from '../helper/database';
import { Message } from '../types/types';

export const sendMessage = async (m: Message) => {
    const sql = 'INSERT INTO messages (from_user_id, to_user_id, film_id, text) VALUES (?,?,?,?)';
    return await db.run_insert(sql, [m.from_user_id, m.to_user_id, m.film_id || null, m.text]);
}

export const getMessagesForAdmin = async () => {
    const sql = 'SELECT * FROM messages ORDER BY created_at DESC';
    return await db.run_query(sql, []);
}

export const getMessagesByUser = async (userId: number) => {
    const sql = 'SELECT * FROM messages WHERE from_user_id = ? OR to_user_id = ? ORDER BY created_at DESC';
    return await db.run_query(sql, [userId, userId]);
}

export const respondToMessage = async (id: number, response: string) => {
    const sql = 'UPDATE messages SET response = ? WHERE id = ?';
    return await db.run_update(sql, [response, id]);
}

export const deleteMessage = async (id: number) => {
    const sql = 'DELETE FROM messages WHERE id = ?';
    return await db.run_update(sql, [id]);
}
