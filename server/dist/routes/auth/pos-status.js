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
const device_auth_hook_1 = require("../../lib/device-auth-hook");
const jwt_helper_1 = require("../../lib/jwt-helper");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const qr_auth_schema_1 = require("../../lib/schemas/qr-auth.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        response: {
            200: qr_auth_schema_1.posStatusResponseSchema,
        },
    };
    app.route({
        url: '/pos-status',
        method: 'GET',
        schema,
        preHandler: [device_auth_hook_1.deviceTokenHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = (0, jwt_helper_1.verifyAccessToken)(req);
                const user = yield user_model_1.UserModel.findById(payload.userId).select('tokenVersion');
                if (!user || user.tokenVersion !== payload.tokenVersion) {
                    return reply.send({ loggedIn: false });
                }
                return reply.send({ loggedIn: true, userId: payload.userId });
            }
            catch (_a) {
                return reply.send({ loggedIn: false });
            }
        }),
    });
    done();
});
