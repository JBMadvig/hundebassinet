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
exports.sendToSubscribers = exports.sendToAllSocket = exports.initWebsocket = exports.activeConnections = void 0;
exports.activeConnections = [];
const initWebsocket = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    yield fastify.register(function (fastify) {
        fastify.get('/ws', { websocket: true }, (newSocket) => {
            newSocket.send(JSON.stringify({ type: 'initRequest' }));
            exports.activeConnections.push({
                webSocket: newSocket,
                roomsSubscribed: [],
            });
            newSocket.addEventListener('message', (message) => {
                try {
                    const data = JSON.parse(message.data);
                    handleIncomingMessage(newSocket, data);
                }
                catch (error) {
                    console.error('Invalid JSON received:', message.data);
                }
            });
            newSocket.addEventListener('close', () => {
                const index = exports.activeConnections.findIndex((s) => s.webSocket === newSocket);
                if (index > -1) {
                    exports.activeConnections.splice(index, 1);
                }
            });
        });
    });
});
exports.initWebsocket = initWebsocket;
const sendToAllSocket = (payload) => {
    for (const conn of exports.activeConnections) {
        conn.webSocket.send(JSON.stringify(payload));
    }
};
exports.sendToAllSocket = sendToAllSocket;
const sendToSubscribers = (roomId, payload) => {
    for (const conn of exports.activeConnections) {
        if (conn.roomsSubscribed.includes(roomId)) {
            conn.webSocket.send(JSON.stringify(payload));
        }
    }
};
exports.sendToSubscribers = sendToSubscribers;
const handleIncomingMessage = (socket, payload) => {
    switch (payload.type) {
        case 'ping':
            console.log('Ping');
            break;
        case 'subscribe': {
            const conn = exports.activeConnections.find((c) => c.webSocket === socket);
            if (conn && !conn.roomsSubscribed.includes(payload.room)) {
                conn.roomsSubscribed.push(payload.room);
            }
            break;
        }
        case 'unsubscribe': {
            const conn = exports.activeConnections.find((c) => c.webSocket === socket);
            if (conn) {
                conn.roomsSubscribed = conn.roomsSubscribed.filter((r) => r !== payload.room);
            }
            break;
        }
        // These are only ever sent by the server
        case 'initRequest':
        case 'pos-login':
        case 'pos-logout':
        case 'item-scanned':
        case 'new-item-scanned':
            break;
        default:
            payload;
    }
};
