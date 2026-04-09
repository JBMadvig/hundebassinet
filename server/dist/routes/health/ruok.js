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
exports.default = (function (app, opts, done) {
    const schema = {
        response: {
            200: typebox_1.Type.String(),
        },
    };
    app.route({
        url: '/ruok',
        method: 'GET',
        schema,
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            yield reply.send('iamok');
        }),
    });
    done();
});
