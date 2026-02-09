import { FastifyPluginCallback } from 'fastify';

export default <FastifyPluginCallback>async function (app) {
    await app.register(import('./get-users'));
};
