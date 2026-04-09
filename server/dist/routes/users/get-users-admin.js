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
const user_model_1 = require("../../lib/mongodb/models/user.model");
const user_schema_1 = require("../../lib/schemas/user.schema");
exports.default = (function (app, opts, done) {
    const schema = {
        response: {
            200: typebox_1.Type.Array(user_schema_1.userDashboardSchema),
        },
    };
    app.route({
        url: '/admin-data',
        method: 'GET',
        schema,
        preHandler: [(0, auth_hooks_1.requireRole)(['admin'])],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            // Fetch user data for admin panel (requires admin role) but exclude users with role "sudo-admin"
            const users = yield user_model_1.UserModel.find({ role: { $ne: 'sudo-admin' } });
            // Get users currency setting for convertion of prices and values
            const user = yield user_model_1.UserModel.findById(req.user.userId).select('currency');
            const currency = (user === null || user === void 0 ? void 0 : user.currency) || 'DKK';
            yield reply.send(users.map(user => {
                const userObject = user.toObject();
                // Convert balance from DKK to the user's currency
                userObject.balance = (0, currency_service_1.convertFromDKK)(userObject.balance, currency);
                return userObject;
            }));
        }),
    });
    done();
});
