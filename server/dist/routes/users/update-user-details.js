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
const currency_service_1 = require("../../services/currency.service");
const typebox_1 = require("@sinclair/typebox");
const mongodb_1 = require("mongodb");
const auth_hooks_1 = require("../../lib/auth-hooks");
const fastify_types_1 = require("../../lib/fastify-types");
const http_errors_1 = require("../../lib/http-errors");
const jwt_helper_1 = require("../../lib/jwt-helper");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const user_schema_1 = require("../../lib/schemas/user.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        params: typebox_1.Type.Object({
            id: fastify_types_1.ObjectIdStringType,
        }),
        body: typebox_1.Type.Object({
            name: typebox_1.Type.Optional(typebox_1.Type.String({ minLength: 2, maxLength: 100 })),
            email: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'email' })),
            currency: typebox_1.Type.Optional(typebox_1.Type.String()),
            role: typebox_1.Type.Optional(user_schema_1.userRolesEnum),
            balance: typebox_1.Type.Optional(typebox_1.Type.Number()),
        }),
        response: {
            200: typebox_1.Type.Object({
                user: user_schema_1.userPublicSchema,
                accessToken: typebox_1.Type.Optional(typebox_1.Type.String()),
                refreshToken: typebox_1.Type.Optional(typebox_1.Type.String()),
            }),
        },
    };
    app.route({
        url: '/:id',
        method: 'POST',
        schema,
        preHandler: [auth_hooks_1.authenticateHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const targetUserId = req.params.id;
            const requestingUser = req.user;
            // Load target user
            const targetUser = yield user_model_1.UserModel.findById(targetUserId);
            if (!targetUser) {
                throw new http_errors_1.NotFoundError('User not found');
            }
            const isSelf = requestingUser.userId === targetUserId;
            const requestorRole = requestingUser.role;
            const isAdmin = requestorRole === user_model_1.UserRoles.ADMIN;
            const isSudoAdmin = requestorRole === user_model_1.UserRoles.SUDO_ADMIN;
            const isAdminOrAbove = isAdmin || isSudoAdmin;
            // Global guard: admins cannot modify sudo-admin users (unless it's themselves)
            if (!isSelf && isAdmin && targetUser.role === user_model_1.UserRoles.SUDO_ADMIN) {
                throw new http_errors_1.ForbiddenError('Admins cannot modify sudo-admin users');
            }
            // Ensure at least one field is being updated
            if (req.body.name === undefined && req.body.email === undefined && req.body.currency === undefined && req.body.role === undefined && req.body.balance === undefined) {
                throw new http_errors_1.BadRequestError('No fields to update');
            }
            // Track whether email or role changed (for token handling)
            let emailChanged = false;
            let roleChanged = false;
            // NAME: admin/sudo-admin OR self
            if (req.body.name !== undefined) {
                if (!isAdminOrAbove && !isSelf) {
                    throw new http_errors_1.ForbiddenError('You do not have permission to update this user\'s name');
                }
                targetUser.name = req.body.name;
            }
            // EMAIL: admin/sudo-admin OR self
            if (req.body.email !== undefined) {
                if (!isAdminOrAbove && !isSelf) {
                    throw new http_errors_1.ForbiddenError('You do not have permission to update this user\'s email');
                }
                if (req.body.email !== targetUser.email) {
                    emailChanged = true;
                }
                targetUser.email = req.body.email;
            }
            // EMAIL: admin/sudo-admin OR self
            if (req.body.currency !== undefined) {
                if (!isAdminOrAbove && !isSelf) {
                    throw new http_errors_1.ForbiddenError('You do not have permission to update this user\'s currency');
                }
                targetUser.currency = req.body.currency;
            }
            // BALANCE: admin/sudo-admin only
            if (req.body.balance !== undefined) {
                if (!isAdminOrAbove) {
                    throw new http_errors_1.ForbiddenError('Only admins can update user balance');
                }
                targetUser.balance = (0, currency_service_1.convertToDKK)(req.body.balance, targetUser.currency);
            }
            // ROLE: complex authorization rules
            if (req.body.role !== undefined) {
                if (!isAdminOrAbove) {
                    throw new http_errors_1.ForbiddenError('Only admins can update user roles');
                }
                const newRole = req.body.role;
                // Block admin self-demotion
                if (isSelf && isAdmin && newRole === user_model_1.UserRoles.USER) {
                    throw new http_errors_1.ForbiddenError('Cannot demote yourself. Ask a sudo-admin.');
                }
                if (isAdmin) {
                    // Admin can only change users whose current role is 'user' or 'admin'
                    if (targetUser.role === user_model_1.UserRoles.SUDO_ADMIN) {
                        throw new http_errors_1.ForbiddenError('Admins cannot change the role of a sudo-admin');
                    }
                    // Admin can only assign 'user' or 'admin'
                    if (newRole === user_model_1.UserRoles.SUDO_ADMIN) {
                        throw new http_errors_1.ForbiddenError('Admins cannot assign the sudo-admin role');
                    }
                }
                // sudo-admin can change any user to any role (no additional checks)
                if (newRole !== targetUser.role) {
                    roleChanged = true;
                }
                targetUser.role = newRole;
            }
            // Token invalidation: if another user's email or role changed, increment their tokenVersion
            if (!isSelf && (emailChanged || roleChanged)) {
                targetUser.tokenVersion = ((_a = targetUser.tokenVersion) !== null && _a !== void 0 ? _a : 0) + 1;
            }
            // Save with duplicate-key error handling
            try {
                yield targetUser.save();
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoServerError) {
                    if (error.code === 11000) {
                        throw new http_errors_1.ConflictError('A user with this email already exists', {
                            value: error.keyValue,
                        });
                    }
                }
                console.error('Error updating user:', error);
                throw new http_errors_1.InternalServerError();
            }
            // Token refresh for self: if the requesting user changed their own email or role
            let accessToken;
            let refreshToken;
            if (isSelf && (emailChanged || roleChanged)) {
                const tokens = yield (0, jwt_helper_1.generateTokens)(reply, targetUser);
                accessToken = tokens.accessToken;
                refreshToken = tokens.refreshToken;
            }
            const userObj = targetUser.toObject();
            yield reply.send(Object.assign(Object.assign({ user: Object.assign(Object.assign({}, userObj), { balance: (0, currency_service_1.convertFromDKK)(userObj.balance, userObj.currency) }) }, (accessToken && { accessToken })), (refreshToken && { refreshToken })));
        }),
    });
    done();
});
