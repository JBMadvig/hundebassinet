"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmpSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const fastify_types_1 = require("../fastify-types");
exports.tmpSchema = typebox_1.Type.Object({
    _id: fastify_types_1.MongooseObjectIdType,
    name: typebox_1.Type.String(),
    createdAt: fastify_types_1.MongooseDateType,
    updatedAt: fastify_types_1.MongooseDateType,
});
