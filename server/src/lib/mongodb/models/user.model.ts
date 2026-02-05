import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
    SUDO_ADMIN = 'sudo-admin',
}

export class User extends TimeStamps {
    @prop({ type: () => String, required: true, unique: true })
    public email: string;

    @prop({ type: () => String, required: true })
    public name: string;

    @prop({ type: () => String, required: true, enum: UserRoles, default: UserRoles.USER })
    public role: UserRoles;

    @prop({ type: () => Number, required: true, default: 0 })
    public balance: number;

    @prop({ type: () => String, required: true, default: 'DKK' })
    public valuta: string;

    @prop({ type: () => String, required: true, default: '' })
    public avatarUrl: string;
}

export const UserModel = getModelForClass(User);
export type UserDocument = DocumentType<User>;
