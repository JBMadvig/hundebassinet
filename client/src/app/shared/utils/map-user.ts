import { environment } from '../../../environments/environment';
import { User } from '../types/user.types';

type RawUser = Omit<User, 'id'> & { _id?: string; id?: string };

const serverBaseUrl = environment.apiUrl.replace('/api', '');

export function mapUser(raw: RawUser): User {
    const { _id, ...rest } = raw;

    let avatarUrl = rest.avatarUrl || '';
    if (avatarUrl.startsWith('/')) {
        avatarUrl = `${serverBaseUrl}${avatarUrl}`;
    }

    return { id: (_id ?? rest.id) as string, ...rest, avatarUrl };
}
