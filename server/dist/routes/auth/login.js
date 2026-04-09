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
const http_errors_1 = require("../../lib/http-errors");
const jwt_helper_1 = require("../../lib/jwt-helper");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const user_schema_1 = require("../../lib/schemas/user.schema");
exports.default = (function (app, _opts, done) {
    const schema = {
        body: user_schema_1.loginRequestSchema,
        response: {
            200: user_schema_1.authResponseSchema,
        },
    };
    app.route({
        url: '/login',
        method: 'POST',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            // Find user with password field explicitly selected
            const user = yield user_model_1.UserModel.findOne({ email }).select('+password');
            if (!user) {
                throw new http_errors_1.UnauthorizedError('Invalid email or password');
            }
            // Compare password
            const isValidPassword = yield user.comparePassword(password);
            if (!isValidPassword) {
                throw new http_errors_1.UnauthorizedError('Invalid email or password');
            }
            // Generate tokens (sets HttpOnly cookies automatically)
            yield (0, jwt_helper_1.generateTokens)(reply, user);
            // Return user without password
            const _a = user.toObject(), { password: _ } = _a, userResponse = __rest(_a, ["password"]);
            yield reply.send({
                user: userResponse,
            });
        }),
    });
    done();
});
