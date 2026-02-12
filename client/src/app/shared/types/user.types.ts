export type UserRoles = 'admin' | 'user' | 'sudo-admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRoles;
    balance: number;
    valuta: string;
    // Valuta is ISO 4217 format, e.g., 'USD', 'EUR', 'DKK'
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserWithPassword = User & {
    password: string;
};
