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
const auth_hooks_1 = require("../../lib/auth-hooks");
const http_errors_1 = require("../../lib/http-errors");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const user_schema_1 = require("../../lib/schemas/user.schema");
exports.default = (function (app, opts, done) {
    const schema = {
        response: {
            200: user_schema_1.userPublicSchema,
        },
    };
    app.route({
        url: '/me',
        method: 'GET',
        schema,
        preHandler: [auth_hooks_1.authenticateHook], // Protected route
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // User payload is available from authenticateHook
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                throw new http_errors_1.NotFoundError('User not found');
            }
            // Find user
            const user = yield user_model_1.UserModel.findById(userId);
            if (!user) {
                throw new http_errors_1.NotFoundError('User not found');
            }
            yield reply.send(user.toObject());
        }),
    });
    done();
});
