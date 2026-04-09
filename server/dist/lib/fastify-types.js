"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceType = exports.ObjectIdStringType = exports.MongooseObjectIdType = exports.MongooseDateType = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
// Return scheam types for values from mongoose
exports.MongooseDateType = type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Unsafe({ type: 'string', format: 'date-time' }));
exports.MongooseObjectIdType = type_provider_typebox_1.Type.Unsafe();
// This is for input validation schema for fastify
exports.ObjectIdStringType = type_provider_typebox_1.Type.String({ pattern: '^[0-9a-fA-F]{24}$' });
const referenceType = (schema) => {
    return type_provider_typebox_1.Type.Array(type_provider_typebox_1.Type.Union([schema, type_provider_typebox_1.Type.Unsafe()]));
};
exports.referenceType = referenceType;
