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
            id: typebox_1.Type.String(),
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
                itemUpdated: item_schema_1.CollectionItemSchema,
                currency: typebox_1.Type.String(),
                avgPriceChange: typebox_1.Type.Object({
                    prevAvgPrice: typebox_1.Type.Number(),
                    newAvgPrice: typebox_1.Type.Number(),
                }),
                stockChange: typebox_1.Type.Object({
                    prevStock: typebox_1.Type.Number(),
                    newStock: typebox_1.Type.Number(),
                }),
                totalStockValueChange: typebox_1.Type.Object({
                    prevTotalStockValue: typebox_1.Type.Number(),
                    newTotalStockValue: typebox_1.Type.Number(),
                }),
            }),
        },
    };
    app.route({
        url: '/update-item',
        method: 'UPDATE',
        schema,
        preHandler: [auth_hooks_1.authenticateHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id, name, primaryCategory, secondaryCategory, abv, volume, currency, price, amount, } = req.body;
            // Get the item from the inventory to update the average price and total stock value
            const prevItem = yield item_model_1.ItemModel.findById(id);
            if (!prevItem) {
                throw new http_errors_1.InternalServerError('Item not found in inventory');
            }
            // Calculate new average price and total stock value based on existing values and new values
            const danishPrice = (0, currency_service_1.convertToDKK)(price, currency);
            const newTotalStock = prevItem.currentStock + amount;
            const newTotalStockValue = prevItem.totalStockValue + danishPrice;
            const averagePrice = newTotalStockValue / newTotalStock;
            let updatedItem;
            try {
                updatedItem = yield item_model_1.ItemModel.findByIdAndUpdate(id, {
                    name,
                    primaryCategory,
                    secondaryCategory,
                    abv,
                    volume,
                    averagePrice,
                    currentStock: newTotalStock,
                    totalStockValue: newTotalStockValue,
                }, { new: true });
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoServerError && error.code === 11000) {
                    throw new http_errors_1.ConflictError('An item with this name already exists');
                }
                console.error('Error creating item:', error);
                throw new http_errors_1.InternalServerError();
            }
            if (!updatedItem) {
                throw new http_errors_1.InternalServerError('Failed to retrieve updated item');
            }
            return reply.status(200).send({
                itemUpdated: updatedItem.toObject(),
                currency,
                avgPriceChange: {
                    prevAvgPrice: (0, currency_service_1.convertFromDKK)(prevItem.averagePrice, currency),
                    newAvgPrice: (0, currency_service_1.convertFromDKK)(averagePrice, currency),
                },
                stockChange: {
                    prevStock: prevItem.currentStock,
                    newStock: newTotalStock,
                },
                totalStockValueChange: {
                    prevTotalStockValue: (0, currency_service_1.convertFromDKK)(prevItem.totalStockValue, currency),
                    newTotalStockValue: (0, currency_service_1.convertFromDKK)(newTotalStockValue, currency),
                },
            });
        }),
    });
    done();
});
