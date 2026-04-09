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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const currency_service_1 = require("./services/currency.service");
const websocket_service_1 = require("./services/websocket.service");
const fastify_1 = __importDefault(require("fastify"));
const http_errors_1 = require("./lib/http-errors");
const mongodb_1 = require("./lib/mongodb");
const routes_1 = __importDefault(require("./routes"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('⏱️  Starting server...');
    yield (0, mongodb_1.connectToMongoDB)();
    yield (0, currency_service_1.initCurrencyService)();
    const fastify = (0, fastify_1.default)().withTypeProvider();
    // Register JWT plugin
    yield fastify.register(jwt_1.default, {
        secret: process.env['JWT_SECRET'] || 'your-secret-key-change-in-production',
    });
    yield fastify.register(cookie_1.default);
    yield fastify.register(websocket_1.default);
    yield (0, websocket_service_1.initWebsocket)(fastify);
    yield fastify.register(cors_1.default, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-headers'],
    });
    yield fastify.register(multipart_1.default, {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB max
            files: 1,
        },
    });
    fastify.setErrorHandler(http_errors_1.httpErrorHandler);
    fastify.setNotFoundHandler(http_errors_1.notFoundHandler);
    yield fastify.register(routes_1.default, { prefix: '/api' });
    const port = Number(process.env['SERVER_PORT']) || 9001;
    const address = yield fastify.listen({ port, host: '0.0.0.0' });
    console.log(`💡 Server running on ${address}`);
}))().catch((err) => {
    console.error('An error occurred while starting the server:');
    console.error(err);
    process.exit(1);
});
