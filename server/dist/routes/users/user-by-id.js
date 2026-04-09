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
const http_errors_1 = require("../../lib/http-errors");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const user_schema_1 = require("../../lib/schemas/user.schema");
exports.default = (function (app, opts, done) {
    const schema = {
        params: typebox_1.Type.Object({
            id: typebox_1.Type.String(),
        }),
        response: {
            200: user_schema_1.userPublicSchema,
        },
    };
    app.route({
        url: '/:id',
        method: 'GET',
        schema,
        preHandler: [(0, auth_hooks_1.requireRole)(['admin', 'sudo-admin'])],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            // Fetch user data except password - If changed, we send the pasted old ++ two news to compare if they are right.
            const user = yield user_model_1.UserModel.findById(req.params.id).select('_id name email role balance currency avatarUrl');
            if (!user) {
                throw new http_errors_1.UnauthorizedError('User not found');
            }
            const userObj = user.toObject();
            yield reply.send(Object.assign(Object.assign({}, userObj), { balance: (0, currency_service_1.convertFromDKK)(userObj.balance, userObj.currency) }));
        }),
    });
    done();
});
