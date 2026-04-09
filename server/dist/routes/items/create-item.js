"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const currency_service_1 = require("../../services/currency.service");
const typebox_1 = require("@sinclair/typebox");
const mongodb_1 = require("mongodb");
const auth_hooks_1 = require("../../lib/auth-hooks");
const http_errors_1 = require("../../lib/http-errors");
const item_model_1 = require("../../lib/mongodb/models/item.model");
const item_schema_1 = require("../../lib/schemas/item.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        body: typebox_1.Type.Object({
            name: typebox_1.Type.String(),
            primaryCategory: item_schema_1.PrimaryItemUnionCategories,
            secondaryCategory: typebox_1.Type.String(),
            abv: typebox_1.Type.Number(),
            volume: typebox_1.Type.Number(),
            price: typebox_1.Type.Number(),
            currency: typebox_1.Type.String(),
            amount: typebox_1.Type.Number(),
        }),
        response: {
            200: typebox_1.Type.Object({
                itemAdded: item_schema_1.CollectionItemSchema,
            }),
        },
    };
    app.route({
        url: '/create-item',
        method: 'POST',
        schema,
        preHandler: [auth_hooks_1.authenticateHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const { name, primaryCategory, secondaryCategory, abv, volume, price, amount, currency, } = req.body;
            const convertedPrice = (0, currency_service_1.convertToDKK)(price, currency);
            const averagePrice = convertedPrice / amount;
            const totalStockValue = averagePrice * amount;
            const newItem = new item_model_1.ItemModel({
                name,
                primaryCategory,
                secondaryCategory,
                abv,
                volume,
                averagePrice,
                currentStock: amount,
                totalStockValue,
            });
            try {
                yield newItem.save();
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoServerError && error.code === 11000) {
                    throw new http_errors_1.ConflictError('An item with this name already exists');
                }
                console.error('Error creating item:', error);
                throw new http_errors_1.InternalServerError();
            }
            return reply.status(200).send({
                itemAdded: newItem.toObject(),
            });
        }),
    });
    done();
});
