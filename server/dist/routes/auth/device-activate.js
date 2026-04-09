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
const cookie_helper_1 = require("../../lib/cookie-helper");
const http_errors_1 = require("../../lib/http-errors");
const device_token_model_1 = require("../../lib/mongodb/models/device-token.model");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const qr_auth_schema_1 = require("../../lib/schemas/qr-auth.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        body: qr_auth_schema_1.deviceActivateRequestSchema,
        response: {
            200: qr_auth_schema_1.deviceActivateResponseSchema,
        },
    };
    app.route({
        url: '/device-activate',
        method: 'POST',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, deviceName } = req.body;
            const user = yield user_model_1.UserModel.findOne({ email }).select('+password');
            if (!user) {
                throw new http_errors_1.UnauthorizedError('Invalid email or password');
            }
            const isValidPassword = yield user.comparePassword(password);
            if (!isValidPassword) {
                throw new http_errors_1.UnauthorizedError('Invalid email or password');
            }
            if (user.role !== user_model_1.UserRoles.SUDO_ADMIN) {
                throw new http_errors_1.ForbiddenError('Only sudo-admin users can activate devices');
            }
            const token = crypto_1.default.randomBytes(48).toString('hex');
            const name = deviceName || 'POS Device';
            yield device_token_model_1.DeviceTokenModel.create({
                token,
                activatedBy: user._id,
                deviceName: name,
                active: true,
            });
            (0, cookie_helper_1.setDeviceCookie)(reply, token);
            yield reply.send({
                deviceName: name,
            });
        }),
    });
    done();
});
