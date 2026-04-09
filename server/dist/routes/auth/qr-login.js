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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_auth_hook_1 = require("../../lib/device-auth-hook");
const http_errors_1 = require("../../lib/http-errors");
const jwt_helper_1 = require("../../lib/jwt-helper");
const qr_token_model_1 = require("../../lib/mongodb/models/qr-token.model");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const qr_auth_schema_1 = require("../../lib/schemas/qr-auth.schema");
const websocket_service_1 = require("../../services/websocket.service");
exports.default = (function (app, _opts, done) {
    const schema = {
        body: qr_auth_schema_1.qrLoginRequestSchema,
        response: {
            200: qr_auth_schema_1.qrLoginResponseSchema,
        },
    };
    app.route({
        url: '/qr-login',
        method: 'POST',
        schema,
        preHandler: [device_auth_hook_1.deviceTokenHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            // Atomically find and mark as used to prevent race conditions
            const qrToken = yield qr_token_model_1.QrTokenModel.findOneAndUpdate({
                token: req.body.qrToken,
                used: false,
                expiresAt: { $gt: new Date() },
            }, { $set: { used: true } }, { new: true });
            if (!qrToken) {
                throw new http_errors_1.UnauthorizedError('Invalid or expired QR code');
            }
            const user = yield user_model_1.UserModel.findById(qrToken.userId);
            if (!user) {
                throw new http_errors_1.NotFoundError('User not found');
            }
            // Generate tokens (sets HttpOnly cookies automatically)
            yield (0, jwt_helper_1.generateTokens)(reply, user);
            // Notify phone via WebSocket
            (0, websocket_service_1.sendToSubscribers)(`user:${user._id.toString()}`, {
                type: 'pos-login',
                userId: user._id.toString(),
            });
            const _a = user.toObject(), { password: _ } = _a, userResponse = __rest(_a, ["password"]);
            yield reply.send({
                user: userResponse,
            });
        }),
    });
    done();
});
