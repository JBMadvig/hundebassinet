import { FastifyPluginCallback } from 'fastify';

export default <FastifyPluginCallback>async function (app) {
    const routes = [
        app.register(import('./register')),
        app.register(import('./login')),
        app.register(import('./refresh')),
        app.register(import('./me')),
    ];

    await Promise.all(routes);
};
