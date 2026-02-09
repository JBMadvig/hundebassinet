import { User } from '../types/user.types';

export function mapUser(raw: any): User {
    const { _id, ...rest } = raw;
    return { id: _id ?? raw.id, ...rest };
}
