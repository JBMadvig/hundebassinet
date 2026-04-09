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
const tmp_model_1 = require("../../lib/mongodb/models/tmp.model");
const tmp_schedule_1 = require("../../lib/schemas/tmp.schedule");
exports.default = (function (app, opts, done) {
    const schema = {
        querystring: typebox_1.Type.Object({
            name: typebox_1.Type.Optional(typebox_1.Type.String()),
        }),
        response: {
            200: typebox_1.Type.Array(tmp_schedule_1.tmpSchema),
        },
    };
    app.route({
        url: '/',
        method: 'GET',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const aggregatePipeline = [];
            const match = {};
            if (req.query.name) {
                match.name = req.query.name;
            }
            if (Object.keys(match).length > 0) {
                aggregatePipeline.push({
                    $match: match,
                });
            }
            else {
                // If no query params, we still need to match all documents
                aggregatePipeline.push({
                    $match: {},
                });
            }
            const docs = yield tmp_model_1.TmpModel.aggregate(aggregatePipeline).exec();
            yield reply.send(docs);
        }),
    });
    done();
});
