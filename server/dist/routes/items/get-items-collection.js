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
const auth_hooks_1 = require("../../lib/auth-hooks");
const item_model_1 = require("../../lib/mongodb/models/item.model");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const item_schema_1 = require("../../lib/schemas/item.schema");
exports.default = (function (app, opts, done) {
    const schema = {
        response: {
            200: typebox_1.Type.Object({
                items: typebox_1.Type.Array(item_schema_1.CollectionItemSchema),
                currency: typebox_1.Type.String(),
            }),
        },
    };
    app.route({
        url: '/get-items-collection',
        method: 'GET',
        schema,
        preHandler: [auth_hooks_1.authenticateHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const items = yield item_model_1.ItemModel.find({}).select('_id name primaryCategory secondaryCategory averagePrice volume currentStock abv');
            // Get users currency setting for convertion of prices and values
            const user = yield user_model_1.UserModel.findById(req.user.userId).select('currency');
            const currency = (user === null || user === void 0 ? void 0 : user.currency) || 'DKK';
            yield reply.send({
                items: items.map(item => {
                    const obj = item.toObject();
                    return Object.assign(Object.assign({}, obj), { averagePrice: (0, currency_service_1.convertFromDKK)(obj.averagePrice, currency) });
                }),
                currency,
            });
        }),
    });
    done();
});
