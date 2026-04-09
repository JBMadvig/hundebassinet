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
const websocket_service_1 = require("../../services/websocket.service");
const typebox_1 = require("@sinclair/typebox");
const auth_hooks_1 = require("../../lib/auth-hooks");
const http_errors_1 = require("../../lib/http-errors");
const item_model_1 = require("../../lib/mongodb/models/item.model");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const item_schema_1 = require("../../lib/schemas/item.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        body: typebox_1.Type.Object({
            barcode: typebox_1.Type.String(),
            targetUserId: typebox_1.Type.String(),
        }),
        response: {
            200: typebox_1.Type.Object({
                item: typebox_1.Type.Optional(item_schema_1.CollectionItemSchema),
                currency: typebox_1.Type.Optional(typebox_1.Type.String()),
                barcode: typebox_1.Type.Optional(typebox_1.Type.String()),
            }),
        },
    };
    app.route({
        url: '/scan',
        method: 'POST',
        schema,
        preHandler: [auth_hooks_1.authenticateHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const { barcode, targetUserId } = req.body;
            const item = yield item_model_1.ItemModel.findOne({ barcode });
            const itemExists = !!item;
            switch (true) {
                case targetUserId !== req.user.userId:
                    throw new http_errors_1.ForbiddenError('You can only scan items for yourself');
                    break;
                case !itemExists:
                    // Notify POS clients about the new barcode, so they can prompt the user to add it or use the barcode for creating new items
                    (0, websocket_service_1.sendToSubscribers)(`pos:${targetUserId}`, {
                        type: 'new-item-scanned',
                        barcode,
                    });
                    yield reply.send({
                        barcode,
                    });
                    break;
                case itemExists: {
                    const user = yield user_model_1.UserModel.findById(req.user.userId).select('currency');
                    const currency = (user === null || user === void 0 ? void 0 : user.currency) || 'DKK';
                    const obj = item.toObject();
                    const mappedItem = Object.assign(Object.assign({}, obj), { averagePrice: (0, currency_service_1.convertFromDKK)(obj.averagePrice, currency) });
                    (0, websocket_service_1.sendToSubscribers)(`pos:${targetUserId}`, {
                        type: 'item-scanned',
                        item: {
                            id: obj._id.toString(),
                            name: obj.name,
                            primaryCategory: obj.primaryCategory,
                            secondaryCategory: obj.secondaryCategory,
                            averagePrice: (0, currency_service_1.convertFromDKK)(obj.averagePrice, currency),
                            currentStock: obj.currentStock,
                            abv: obj.abv,
                            volume: obj.volume,
                        },
                    });
                    yield reply.send({
                        item: mappedItem,
                        currency,
                    });
                }
            }
        }),
    });
    done();
});
