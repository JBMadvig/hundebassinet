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
const mongodb_1 = require("mongodb");
const http_errors_1 = require("../../lib/http-errors");
const tmp_model_1 = require("../../lib/mongodb/models/tmp.model");
const tmp_schedule_1 = require("../../lib/schemas/tmp.schedule");
exports.default = (function (app, opts, done) {
    const schema = {
        body: typebox_1.Type.Object({
            name: typebox_1.Type.String(),
        }),
        response: {
            200: tmp_schedule_1.tmpSchema,
        },
    };
    app.route({
        url: '/',
        method: 'POST',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const newDoc = new tmp_model_1.TmpModel({
                name: req.body.name,
            });
            try {
                yield newDoc.save();
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoServerError) {
                    if (error.code === 11000) {
                        throw new http_errors_1.ConflictError('Duplicate key error', {
                            value: error.keyValue,
                        });
                    }
                }
                console.error('Error creating document:', error);
                throw new http_errors_1.InternalServerError();
            }
            yield reply.send(newDoc);
        }),
    });
    done();
});
