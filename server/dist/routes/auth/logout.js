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
const cookie_helper_1 = require("../../lib/cookie-helper");
exports.default = (function (app, _opts, done) {
    app.route({
        url: '/logout',
        method: 'POST',
        handler: (_req, reply) => __awaiter(this, void 0, void 0, function* () {
            (0, cookie_helper_1.clearAuthCookies)(reply);
            yield reply.send({ success: true });
        }),
    });
    done();
});
