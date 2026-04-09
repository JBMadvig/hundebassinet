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
const cookie_helper_1 = require("../../lib/cookie-helper");
const device_auth_hook_1 = require("../../lib/device-auth-hook");
const qr_auth_schema_1 = require("../../lib/schemas/qr-auth.schema");
const websocket_service_1 = require("../../services/websocket.service");
exports.default = (function (app, _opts, done) {
    const schema = {
        body: qr_auth_schema_1.posLogoutRequestSchema,
        response: {
            200: qr_auth_schema_1.posLogoutResponseSchema,
        },
    };
    app.route({
        url: '/pos-logout',
        method: 'POST',
        schema,
        preHandler: [device_auth_hook_1.deviceTokenHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            // Notify phone via WebSocket
            (0, websocket_service_1.sendToSubscribers)(`user:${req.body.userId}`, {
                type: 'pos-logout',
                userId: req.body.userId,
            });
            // Clear user session cookies but keep device cookie
            (0, cookie_helper_1.clearAuthCookies)(reply);
            yield reply.send({ success: true });
        }),
    });
    done();
});
