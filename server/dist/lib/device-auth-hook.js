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
exports.deviceTokenHook = void 0;
const http_errors_1 = require("./http-errors");
const device_token_model_1 = require("./mongodb/models/device-token.model");
const deviceTokenHook = (request, _reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const deviceToken = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a['deviceToken'];
    if (!deviceToken) {
        throw new http_errors_1.UnauthorizedError('Device token required');
    }
    const device = yield device_token_model_1.DeviceTokenModel.findOne({
        token: deviceToken,
        active: true,
    });
    if (!device) {
        throw new http_errors_1.UnauthorizedError('Invalid or revoked device token');
    }
    request.device = device;
});
exports.deviceTokenHook = deviceTokenHook;
