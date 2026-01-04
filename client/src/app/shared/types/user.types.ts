export type UserRoles = 'admin' | 'user' | 'sudo-admin';

export interface User {
    id: string;
    email: string;
    balance: number;
    createdAt: Date;
    name: string;
    role: UserRoles;
    updatedAt: Date;
    // Valuta is ISO 4217 format, e.g., 'USD', 'EUR', 'DKK'
    valuta: string;
}
