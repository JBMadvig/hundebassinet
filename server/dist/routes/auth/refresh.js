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
const http_errors_1 = require("../../lib/http-errors");
const jwt_helper_1 = require("../../lib/jwt-helper");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const user_schema_1 = require("../../lib/schemas/user.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        response: {
            200: user_schema_1.authResponseSchema,
        },
    };
    app.route({
        url: '/refresh',
        method: 'POST',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            // Verify refresh token
            const payload = yield (0, jwt_helper_1.verifyRefreshToken)(req);
            // Find user
            const user = yield user_model_1.UserModel.findById(payload.userId);
            if (!user) {
                throw new http_errors_1.UnauthorizedError('User not found');
            }
            // Validate tokenVersion to ensure session hasn't been invalidated
            if (user.tokenVersion !== payload.tokenVersion) {
                throw new http_errors_1.UnauthorizedError('Session invalidated. Please log in again.');
            }
            // Generate new tokens (sets HttpOnly cookies automatically)
            yield (0, jwt_helper_1.generateTokens)(reply, user);
            yield reply.send({
                user: user.toObject(),
            });
        }),
    });
    done();
});
