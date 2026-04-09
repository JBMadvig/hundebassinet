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
const typebox_1 = require("@sinclair/typebox");
const auth_hooks_1 = require("../../lib/auth-hooks");
const fastify_types_1 = require("../../lib/fastify-types");
const http_errors_1 = require("../../lib/http-errors");
const jwt_helper_1 = require("../../lib/jwt-helper");
const user_model_1 = require("../../lib/mongodb/models/user.model");
exports.default = (function (app, _opts, done) {
    const schema = {
        params: typebox_1.Type.Object({
            id: fastify_types_1.ObjectIdStringType,
        }),
        body: typebox_1.Type.Object({
            currentPassword: typebox_1.Type.Optional(typebox_1.Type.String()),
            newPassword: typebox_1.Type.String({ minLength: 8 }),
            bypassCurrentPassword: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        }),
        response: {
            200: typebox_1.Type.Object({
                success: typebox_1.Type.Boolean(),
                accessToken: typebox_1.Type.Optional(typebox_1.Type.String()),
                refreshToken: typebox_1.Type.Optional(typebox_1.Type.String()),
            }),
        },
    };
    app.route({
        url: '/:id/change-password',
        method: 'POST',
        schema,
        preHandler: [auth_hooks_1.authenticateHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const targetUserId = req.params.id;
            const requestingUser = req.user;
            const isSelf = requestingUser.userId === targetUserId;
            const requestorRole = requestingUser.role;
            const isSudoAdmin = requestorRole === user_model_1.UserRoles.SUDO_ADMIN;
            // Only the user themselves or a sudo-admin can change passwords
            if (!isSelf && !isSudoAdmin) {
                throw new http_errors_1.ForbiddenError('You do not have permission to change this user\'s password');
            }
            // Load target user with password field
            const targetUser = yield user_model_1.UserModel.findById(targetUserId).select('+password');
            if (!targetUser) {
                throw new http_errors_1.NotFoundError('User not found');
            }
            const bypassCurrentPassword = req.body.bypassCurrentPassword;
            if (bypassCurrentPassword) {
                // Only sudo-admins can bypass the current password check
                if (!isSudoAdmin) {
                    throw new http_errors_1.ForbiddenError('Only sudo-admins can bypass the current password check');
                }
            }
            else {
                // Current password is required
                if (!req.body.currentPassword) {
                    throw new http_errors_1.BadRequestError('Current password is required');
                }
                const isCorrect = yield targetUser.comparePassword(req.body.currentPassword);
                if (!isCorrect) {
                    throw new http_errors_1.UnauthorizedError('Incorrect current password');
                }
            }
            // Update password (pre-save hook handles hashing)
            targetUser.password = req.body.newPassword;
            // Invalidate existing sessions
            targetUser.tokenVersion = ((_a = targetUser.tokenVersion) !== null && _a !== void 0 ? _a : 0) + 1;
            yield targetUser.save();
            // If self-edit, return new tokens so the user stays logged in
            let accessToken;
            let refreshToken;
            if (isSelf) {
                const tokens = yield (0, jwt_helper_1.generateTokens)(reply, targetUser);
                accessToken = tokens.accessToken;
                refreshToken = tokens.refreshToken;
            }
            yield reply.send(Object.assign(Object.assign({ success: true }, (accessToken && { accessToken })), (refreshToken && { refreshToken })));
        }),
    });
    done();
});
