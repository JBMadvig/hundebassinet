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
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.generateTokens = generateTokens;
const cookie_helper_1 = require("./cookie-helper");
const http_errors_1 = require("./http-errors");
function verifyAccessToken(request) {
    var _a;
    const token = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a['accessToken'];
    if (!token) {
        throw new http_errors_1.UnauthorizedError('No access token provided');
    }
    try {
        const payload = request.server.jwt.verify(token);
        if (payload.type !== 'access') {
            throw new http_errors_1.UnauthorizedError('Invalid token type');
        }
        return payload;
    }
    catch (error) {
        if (error instanceof http_errors_1.UnauthorizedError)
            throw error;
        throw new http_errors_1.UnauthorizedError('Invalid or expired access token');
    }
}
function verifyRefreshToken(request) {
    var _a;
    const token = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a['refreshToken'];
    if (!token) {
        throw new http_errors_1.UnauthorizedError('No refresh token provided');
    }
    try {
        const payload = request.server.jwt.verify(token);
        if (payload.type !== 'refresh') {
            throw new http_errors_1.UnauthorizedError('Invalid token type');
        }
        return payload;
    }
    catch (error) {
        if (error instanceof http_errors_1.UnauthorizedError)
            throw error;
        throw new http_errors_1.UnauthorizedError('Invalid or expired refresh token');
    }
}
function generateTokens(reply, user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const basePayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            tokenVersion: Number((_a = user.tokenVersion) !== null && _a !== void 0 ? _a : 0),
        };
        // Generate access token (60 minutes)
        const accessToken = yield reply.jwtSign(Object.assign(Object.assign({}, basePayload), { type: 'access' }), { expiresIn: '60m' });
        // Generate refresh token (7 days)
        const refreshToken = yield reply.jwtSign(Object.assign(Object.assign({}, basePayload), { type: 'refresh' }), { expiresIn: '7d' });
        // Set as HttpOnly cookies
        (0, cookie_helper_1.setAuthCookies)(reply, accessToken, refreshToken);
        return { accessToken, refreshToken };
    });
}
