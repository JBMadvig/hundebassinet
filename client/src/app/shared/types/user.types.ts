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

export interface UpdateUserDetailsRequest {
    name?: string;
    email?: string;
    role?: string;
    balance?: number;
}

export interface UpdateUserDetailsResponse {
    user: User;
    accessToken?: string;
    refreshToken?: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    role: string;
    balance: number;
}

export interface CreateUserResponse {
    user: User;
}

export interface ChangePasswordRequest {
    newPassword: string;
    currentPassword?: string;
    bypassCurrentPassword?: boolean;
}

export interface ChangePasswordResponse {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
}
