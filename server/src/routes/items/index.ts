import { FastifyPluginCallback } from 'fastify';

export default <FastifyPluginCallback>async function (app) {

    const routes = [
        app.register(import('./get-items-inventory')),
        app.register(import('./get-items-collection')),
    ];

    await Promise.all(routes);
};
