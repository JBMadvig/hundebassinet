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
exports.authenticateHook = void 0;
exports.requireRole = requireRole;
const http_errors_1 = require("./http-errors");
const jwt_helper_1 = require("./jwt-helper");
const user_model_1 = require("./mongodb/models/user.model");
/**
 * Verifies JWT access token and validates tokenVersion against the database.
 * Throws UnauthorizedError if the token has been invalidated.
 */
function verifyAndValidateUser(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = yield (0, jwt_helper_1.verifyAccessToken)(request);
        const user = yield user_model_1.UserModel.findById(payload.userId).select('tokenVersion');
        if (!user || user.tokenVersion !== payload.tokenVersion) {
            throw new http_errors_1.UnauthorizedError('Session invalidated. Please log in again.');
        }
        return payload;
    });
}
/**
 * Fastify preHandler hook to authenticate requests
 * Verifies JWT access token, validates tokenVersion, and attaches user payload to request
 */
const authenticateHook = (request, _reply) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield verifyAndValidateUser(request);
    request.user = payload;
});
exports.authenticateHook = authenticateHook;
/**
 * Factory function to create a role-based authorization hook
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
function requireRole(allowedRoles) {
    return (request, _reply) => __awaiter(this, void 0, void 0, function* () {
        const payload = yield verifyAndValidateUser(request);
        request.user = payload;
        if (!allowedRoles.includes(payload.role)) {
            throw new http_errors_1.ForbiddenError('Insufficient permissions');
        }
    });
}
