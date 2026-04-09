"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posStatusResponseSchema = exports.posLogoutResponseSchema = exports.posLogoutRequestSchema = exports.deviceActivateResponseSchema = exports.deviceActivateRequestSchema = exports.qrLoginResponseSchema = exports.qrLoginRequestSchema = exports.qrTokenResponseSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const user_schema_1 = require("./user.schema");
// POST /api/auth/qr-token response
exports.qrTokenResponseSchema = typebox_1.Type.Object({
    qrToken: typebox_1.Type.String(),
    expiresAt: typebox_1.Type.String({ format: 'date-time' }),
});
// POST /api/auth/qr-login request body
exports.qrLoginRequestSchema = typebox_1.Type.Object({
    qrToken: typebox_1.Type.String(),
});
// POST /api/auth/qr-login response (tokens are in HttpOnly cookies)
exports.qrLoginResponseSchema = typebox_1.Type.Object({
    user: user_schema_1.userPublicSchema,
});
// POST /api/auth/device-activate request body
exports.deviceActivateRequestSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String({ format: 'email' }),
    password: typebox_1.Type.String(),
    deviceName: typebox_1.Type.Optional(typebox_1.Type.String()),
});
// POST /api/auth/device-activate response (device token is in HttpOnly cookie)
exports.deviceActivateResponseSchema = typebox_1.Type.Object({
    deviceName: typebox_1.Type.String(),
});
// POST /api/auth/pos-logout request body
exports.posLogoutRequestSchema = typebox_1.Type.Object({
    userId: typebox_1.Type.String(),
});
// POST /api/auth/pos-logout response
exports.posLogoutResponseSchema = typebox_1.Type.Object({
    success: typebox_1.Type.Boolean(),
});
// GET /api/auth/pos-status response
exports.posStatusResponseSchema = typebox_1.Type.Object({
    loggedIn: typebox_1.Type.Boolean(),
    userId: typebox_1.Type.Optional(typebox_1.Type.String()),
});
