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
const user_model_1 = require("../../lib/mongodb/models/user.model");
exports.default = (function (app, opts, done) {
    const schema = {
        params: typebox_1.Type.Object({
            userId: fastify_types_1.ObjectIdStringType,
        }),
        response: {
            204: typebox_1.Type.Never(),
        },
    };
    app.route({
        url: '/:userId/delete',
        method: 'DELETE',
        schema,
        preHandler: [(0, auth_hooks_1.requireRole)(['admin', 'sudo-admin'])],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const targetUser = yield user_model_1.UserModel.findById(req.params.userId).exec();
            if (!targetUser)
                throw new http_errors_1.NotFoundError('Document not found');
            if (targetUser.role === user_model_1.UserRoles.SUDO_ADMIN) {
                if (req.user.role !== user_model_1.UserRoles.SUDO_ADMIN) {
                    throw new http_errors_1.ForbiddenError('Only sudo-admins can delete sudo-admin accounts');
                }
                const sudoAdminCount = yield user_model_1.UserModel.countDocuments({ role: user_model_1.UserRoles.SUDO_ADMIN }).exec();
                if (sudoAdminCount <= 1) {
                    throw new http_errors_1.ForbiddenError('Cannot delete the last sudo-admin account');
                }
            }
            yield user_model_1.UserModel.findByIdAndDelete(req.params.userId).exec();
            yield reply.status(204).send();
        }),
    });
    done();
});
