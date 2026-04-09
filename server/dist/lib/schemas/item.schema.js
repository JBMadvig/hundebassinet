"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemSchemaWithSearchAndSortAndPagination = exports.CreateItemSchema = exports.CollectionItemSchema = exports.FullItemSchema = exports.FullItemUnionSchema = exports.SortingUnionDirections = exports.PrimaryItemUnionCategories = void 0;
const typebox_1 = require("@sinclair/typebox");
const fastify_types_1 = require("../fastify-types");
exports.PrimaryItemUnionCategories = typebox_1.Type.Union([
    typebox_1.Type.Literal('beer'),
    typebox_1.Type.Literal('cider'),
    typebox_1.Type.Literal('wine'),
    typebox_1.Type.Literal('spirit'),
    typebox_1.Type.Literal('soda'),
    typebox_1.Type.Literal('other'),
]);
exports.SortingUnionDirections = typebox_1.Type.Union([
    typebox_1.Type.Literal('ascending'),
    typebox_1.Type.Literal('descending'),
]);
exports.FullItemUnionSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('_id'),
    typebox_1.Type.Literal('name'),
    typebox_1.Type.Literal('volume'),
    typebox_1.Type.Literal('barcode'),
    typebox_1.Type.Literal('primaryCategory'),
    typebox_1.Type.Literal('secondaryCategory'),
    typebox_1.Type.Literal('averagePrice'),
    typebox_1.Type.Literal('currentStock'),
    typebox_1.Type.Literal('totalStockValue'),
    typebox_1.Type.Literal('abv'),
    typebox_1.Type.Literal('updatedAt'),
    typebox_1.Type.Literal('createdAt'),
]);
// Full Item schema
exports.FullItemSchema = typebox_1.Type.Object({
    _id: fastify_types_1.MongooseObjectIdType,
    name: typebox_1.Type.String(),
    primaryCategory: exports.PrimaryItemUnionCategories,
    secondaryCategory: typebox_1.Type.String(),
    averagePrice: typebox_1.Type.Number(),
    currentStock: typebox_1.Type.Number(),
    totalStockValue: typebox_1.Type.Number(),
    abv: typebox_1.Type.Number(),
    volume: typebox_1.Type.Number(),
    barcode: typebox_1.Type.Optional(typebox_1.Type.String()),
    updatedAt: fastify_types_1.MongooseDateType,
    createdAt: fastify_types_1.MongooseDateType,
});
// Item schema for collection view
exports.CollectionItemSchema = typebox_1.Type.Object({
    _id: fastify_types_1.MongooseObjectIdType,
    name: typebox_1.Type.String(),
    primaryCategory: exports.PrimaryItemUnionCategories,
    secondaryCategory: typebox_1.Type.String(),
    averagePrice: typebox_1.Type.Number(),
    currentStock: typebox_1.Type.Number(),
    abv: typebox_1.Type.Number(),
    volume: typebox_1.Type.Number(),
    barcode: typebox_1.Type.Optional(typebox_1.Type.String()),
});
// Create Item schema when adding new item to inventory
exports.CreateItemSchema = typebox_1.Type.Object({
    _id: fastify_types_1.MongooseObjectIdType,
    name: typebox_1.Type.String(),
    primaryCategory: exports.PrimaryItemUnionCategories,
    secondaryCategory: typebox_1.Type.String(),
    totalPaid: typebox_1.Type.Number(),
    abv: typebox_1.Type.Number(),
    volume: typebox_1.Type.Number(),
    amount: typebox_1.Type.Number(),
    barcode: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.ItemSchemaWithSearchAndSortAndPagination = typebox_1.Type.Object({
    items: typebox_1.Type.Array(exports.FullItemSchema),
    currency: typebox_1.Type.String(),
    itemsInSearch: typebox_1.Type.Number(),
    totalItems: typebox_1.Type.Number(),
    searchParams: typebox_1.Type.Object({
        searchQuery: typebox_1.Type.String(),
        sortBy: exports.FullItemUnionSchema,
        sortDirection: exports.SortingUnionDirections,
        page: typebox_1.Type.Number({ minimum: 1 }),
        entriesPrPage: typebox_1.Type.Number({ minimum: 1, maximum: 100 }),
        totalPagesWithCurrentLimit: typebox_1.Type.Number(),
    }),
});
