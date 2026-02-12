import { User } from './user.types';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    type: 'access' | 'refresh';
    iat?: number;
    exp?: number;
}

interface RoleList {
    id: number,
    text: string,
    value: string,
}

export const rolesList: RoleList[] = [
    {
        id: 0,
        text: 'User',
        value: 'user',
    },
    {
        id: 1,
        text: 'Admin user',
        value: 'admin',
    },
    {
        id: 2,
        text: 'Sudo admin user',
        value: 'sudo-admin',
    },
];
