import * as db from '../helper/database';

export const findByUsername = async (username: string) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const user = await db.run_query(query, [username]);
    return user;
}