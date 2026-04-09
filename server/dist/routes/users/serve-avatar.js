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
const fastify_types_1 = require("../../lib/fastify-types");
const http_errors_1 = require("../../lib/http-errors");
const user_model_1 = require("../../lib/mongodb/models/user.model");
exports.default = (function (app, _opts, done) {
    const schema = {
        params: typebox_1.Type.Object({
            id: fastify_types_1.ObjectIdStringType,
        }),
    };
    app.route({
        url: '/:id/avatar',
        method: 'GET',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield user_model_1.UserModel.findById(req.params.id)
                .select('+avatarData +avatarMimeType');
            if (!user || !user.avatarData) {
                throw new http_errors_1.NotFoundError('Avatar not found');
            }
            return reply
                .header('Content-Type', (_a = user.avatarMimeType) !== null && _a !== void 0 ? _a : 'image/jpeg')
                .header('Cache-Control', 'no-cache')
                .send(user.avatarData);
        }),
    });
    done();
});
