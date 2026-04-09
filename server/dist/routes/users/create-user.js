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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const currency_service_1 = require("../../services/currency.service");
const typebox_1 = require("@sinclair/typebox");
const mongodb_1 = require("mongodb");
const auth_hooks_1 = require("../../lib/auth-hooks");
const http_errors_1 = require("../../lib/http-errors");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const user_schema_1 = require("../../lib/schemas/user.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        body: typebox_1.Type.Object({
            name: typebox_1.Type.String({ minLength: 2, maxLength: 100 }),
            email: typebox_1.Type.String({ format: 'email' }),
            password: typebox_1.Type.String({ minLength: 8 }),
            currency: typebox_1.Type.String(),
            role: user_schema_1.userRolesEnum,
            balance: typebox_1.Type.Number(),
        }),
        response: {
            201: typebox_1.Type.Object({
                user: user_schema_1.userPublicSchema,
            }),
        },
    };
    app.route({
        url: '/create',
        method: 'POST',
        schema,
        preHandler: [(0, auth_hooks_1.requireRole)(['admin', 'sudo-admin'])],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, currency, role, balance } = req.body;
            const requestorRole = req.user.role;
            // Admins can only assign 'user' or 'admin' roles
            if (requestorRole === user_model_1.UserRoles.ADMIN && role === user_model_1.UserRoles.SUDO_ADMIN) {
                throw new http_errors_1.ForbiddenError('Admins cannot assign the sudo-admin role');
            }
            // Check if user already exists
            const existingUser = yield user_model_1.UserModel.findOne({ email });
            if (existingUser) {
                throw new http_errors_1.ConflictError('A user with this email already exists');
            }
            // Convert balance to DKK currency, before adding it to the database, if the provided currency is not DKK
            const balanceInDKK = (0, currency_service_1.convertToDKK)(balance, currency);
            const newUser = new user_model_1.UserModel({
                email,
                name,
                password,
                role,
                balance: balanceInDKK,
                currency,
                avatarUrl: '',
            });
            try {
                yield newUser.save();
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoServerError && error.code === 11000) {
                    throw new http_errors_1.ConflictError('A user with this email already exists');
                }
                console.error('Error creating user:', error);
                throw new http_errors_1.InternalServerError();
            }
            const _a = newUser.toObject(), { password: _ } = _a, userResponse = __rest(_a, ["password"]);
            // Convert balance back from DKK to the provided currency before sending the response
            yield reply.status(201).send({
                user: Object.assign(Object.assign({}, userResponse), { balance: (0, currency_service_1.convertFromDKK)(userResponse.balance, currency) }),
            });
        }),
    });
    done();
});
