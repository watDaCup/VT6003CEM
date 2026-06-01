export type Role = 'Admin' | 'User' | 'Public';

export interface User {
    id?: number;
    username: string;
    password: string;
    role: Role;
    email?: string;
    profile_photo?: string | null;
}

export interface Film {
    id?: number;
    title: string;
    genre?: string;
    year?: number;
    rating?: number; // 0-10
    description?: string;
}

export interface Message {
    id?: number;
    from_user_id: number;
    to_user_id: number; // admin id
    film_id?: number | null;
    text: string;
    response?: string | null;
    created_at?: string;
}
