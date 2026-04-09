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
        body: typebox_1.Type.Object({
            searchQuery: typebox_1.Type.Optional(typebox_1.Type.String()),
            sortBy: item_schema_1.FullItemUnionSchema,
            sortDirection: item_schema_1.SortingUnionDirections,
            page: typebox_1.Type.Number({ minimum: 1 }),
            entriesPrPage: typebox_1.Type.Number({ minimum: 1, maximum: 100 }),
        }),
        response: {
            200: item_schema_1.ItemSchemaWithSearchAndSortAndPagination,
        },
    };
    app.route({
        url: '/get-items-inventory',
        method: 'POST',
        schema,
        preHandler: [(0, auth_hooks_1.requireRole)(['admin', 'sudo-admin'])],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            // This call is used to get all the items for the /inventory.
            const searchQuery = req.body.searchQuery || '';
            const sortBy = req.body.sortBy;
            const sortDirection = req.body.sortDirection;
            const entriesPrPage = req.body.entriesPrPage;
            const page = req.body.page;
            // Calculate how many entried we should skip, to reach the requested page according to the resultsPrPage
            const resultsToSkip = (page - 1) * entriesPrPage;
            // Make the search filter to use both in `items` and `itemsInSearch` (without sort, skip etc)
            const filter = { name: { $regex: searchQuery, $options: 'i' } };
            const [items, itemsInSearch, totalItems] = yield Promise.all([
                item_model_1.ItemModel
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(resultsToSkip)
                    .limit(entriesPrPage)
                    .select('_id name primaryCategory secondaryCategory averagePrice currentStock totalStockValue abv volume updatedAt createdAt'),
                item_model_1.ItemModel.countDocuments(filter),
                item_model_1.ItemModel.countDocuments(),
            ]);
            const totalPages = Math.ceil(itemsInSearch / req.body.entriesPrPage);
            // Get users currency setting for convertion of prices and values
            const user = yield user_model_1.UserModel.findById(req.user.userId).select('currency');
            const currency = (user === null || user === void 0 ? void 0 : user.currency) || 'DKK';
            yield reply.send({
                items: items.map(item => {
                    const obj = item.toObject();
                    return Object.assign(Object.assign({}, obj), { averagePrice: (0, currency_service_1.convertFromDKK)(obj.averagePrice, currency), totalStockValue: (0, currency_service_1.convertFromDKK)(obj.totalStockValue, currency) });
                }),
                currency,
                itemsInSearch,
                totalItems,
                searchParams: {
                    searchQuery,
                    sortBy,
                    sortDirection,
                    page,
                    entriesPrPage,
                    totalPagesWithCurrentLimit: totalPages,
                },
            });
        }),
    });
    done();
});
