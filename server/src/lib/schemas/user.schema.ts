import { Type } from '@sinclair/typebox';

import { MongooseDateType, MongooseObjectIdType } from '@lib/fastify-types';

export const userRolesEnum = Type.Union([
    Type.Literal('admin'),
    Type.Literal('user'),
    Type.Literal('sudo-admin'),
]);

export const userSchema = Type.Object({
    _id: MongooseObjectIdType,
    email: Type.String({ format: 'email' }),
    name: Type.String(),
    role: userRolesEnum,
    balance: Type.Number(),
    valuta: Type.String({ pattern: '^[A-Z]{3}$' }),
    avatarUrl: Type.String(),
    createdAt: MongooseDateType,
    updatedAt: MongooseDateType,
});
