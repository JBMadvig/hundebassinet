import { FastifyPluginCallback } from 'fastify';

export default <FastifyPluginCallback>async function (app) {

    const routes = [
        app.register(import('./get-users')),
        app.register(import('./user-by-id')),
    ];

    await Promise.all(routes);
};
