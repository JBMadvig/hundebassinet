"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idRequestSchema = exports.authResponseSchema = exports.loginRequestSchema = exports.userSchema = exports.userDashboardSchema = exports.userPublicSchema = exports.userMinimalSchema = exports.userRolesEnum = void 0;
const typebox_1 = require("@sinclair/typebox");
const fastify_types_1 = require("../fastify-types");
exports.userRolesEnum = typebox_1.Type.Union([
    typebox_1.Type.Literal('admin'),
    typebox_1.Type.Literal('user'),
    typebox_1.Type.Literal('sudo-admin'),
]);
// Minimal user schema for login screen (public, no auth required)
exports.userMinimalSchema = typebox_1.Type.Object({
    _id: fastify_types_1.MongooseObjectIdType,
    name: typebox_1.Type.String(),
    email: typebox_1.Type.String({ format: 'email' }),
    avatarUrl: typebox_1.Type.String(),
});
// Public user schema (without password)
exports.userPublicSchema = typebox_1.Type.Object({
    _id: fastify_types_1.MongooseObjectIdType,
    email: typebox_1.Type.String({ format: 'email' }),
    name: typebox_1.Type.String(),
    role: exports.userRolesEnum,
    balance: typebox_1.Type.Number(),
    currency: typebox_1.Type.String({ pattern: '^[A-Z]{3}$' }),
    // TODO: Make required (Type.Number()) once all existing users have been updated with tokenVersion
    tokenVersion: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 })),
    avatarUrl: typebox_1.Type.String(),
    createdAt: fastify_types_1.MongooseDateType,
    updatedAt: fastify_types_1.MongooseDateType,
});
exports.userDashboardSchema = typebox_1.Type.Object({
    _id: fastify_types_1.MongooseObjectIdType,
    email: typebox_1.Type.String({ format: 'email' }),
    name: typebox_1.Type.String(),
    role: exports.userRolesEnum,
    balance: typebox_1.Type.Number(),
    currency: typebox_1.Type.String({ pattern: '^[A-Z]{3}$' }),
    // TODO: Make required (Type.Number()) once all existing users have been updated with tokenVersion
    tokenVersion: typebox_1.Type.Optional(typebox_1.Type.Number({ default: 0 })),
    createdAt: fastify_types_1.MongooseDateType,
    updatedAt: fastify_types_1.MongooseDateType,
});
// For backward compatibility
exports.userSchema = exports.userPublicSchema;
// Auth request schemas
exports.loginRequestSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String({ format: 'email' }),
    password: typebox_1.Type.String(),
});
// Auth response schema (tokens are in HttpOnly cookies, not in the response body)
exports.authResponseSchema = typebox_1.Type.Object({
    user: exports.userPublicSchema,
});
// Id request for deleting specific user
exports.idRequestSchema = typebox_1.Type.Object({
    _id: fastify_types_1.MongooseObjectIdType,
});
