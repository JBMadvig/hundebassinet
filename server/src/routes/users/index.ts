import { FastifyPluginCallback } from 'fastify';

export default <FastifyPluginCallback>async function (app) {

    const routes = [
        app.register(import('./get-users')),
        app.register(import('./user-by-id')),
        app.register(import('./get-users-admin')),
        app.register(import('./get-users-sudo-admin')),
        app.register(import('./upload-avatar')),
        app.register(import('./serve-avatar')),
    ];

    await Promise.all(routes);
};
