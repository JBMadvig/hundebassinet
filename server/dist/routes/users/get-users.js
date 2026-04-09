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
const user_model_1 = require("../../lib/mongodb/models/user.model");
const user_schema_1 = require("../../lib/schemas/user.schema");
exports.default = (function (app, opts, done) {
    const schema = {
        response: {
            200: typebox_1.Type.Array(user_schema_1.userMinimalSchema),
        },
    };
    app.route({
        url: '/',
        method: 'GET',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            // Fetch only minimal user data for login screen (no auth required)
            const users = yield user_model_1.UserModel.find({}).select('_id name email avatarUrl');
            yield reply.send(users.map(user => user.toObject()));
        }),
    });
    done();
});
