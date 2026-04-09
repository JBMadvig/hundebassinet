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
const tmp_model_1 = require("../../lib/mongodb/models/tmp.model");
const tmp_schedule_1 = require("../../lib/schemas/tmp.schedule");
exports.default = (function (app, opts, done) {
    const schema = {
        params: typebox_1.Type.Object({
            tmpId: fastify_types_1.ObjectIdStringType,
        }),
        response: {
            200: tmp_schedule_1.tmpSchema,
        },
    };
    app.route({
        url: '/:tmpId',
        method: 'GET',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const doc = yield tmp_model_1.TmpModel.findById(req.params.tmpId).exec();
            if (!doc)
                throw new http_errors_1.NotFoundError('Document not found');
            yield reply.send(doc);
        }),
    });
    done();
});
