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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const auth_hooks_1 = require("../../lib/auth-hooks");
const qr_token_model_1 = require("../../lib/mongodb/models/qr-token.model");
const qr_auth_schema_1 = require("../../lib/schemas/qr-auth.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        response: {
            200: qr_auth_schema_1.qrTokenResponseSchema,
        },
    };
    app.route({
        url: '/qr-token',
        method: 'POST',
        schema,
        preHandler: [auth_hooks_1.authenticateHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const token = crypto_1.default.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            yield qr_token_model_1.QrTokenModel.create({
                token,
                userId: req.user.userId,
                used: false,
                expiresAt,
            });
            yield reply.send({
                qrToken: token,
                expiresAt: expiresAt.toISOString(),
            });
        }),
    });
    done();
});
