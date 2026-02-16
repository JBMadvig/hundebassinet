import { Type } from '@sinclair/typebox';
import { FastifyPluginCallback, FastifySchema } from 'fastify';

import { authenticateHook } from '@lib/auth-hooks';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '@lib/fastify-types';
import { ItemModel } from '@lib/mongodb/models/item.model';
import { CollectionItemSchema } from '@lib/schemas/item.schema';

export default <FastifyPluginCallback>function (app, opts, done) {
    const schema = {
        response: {
            200: Type.Array(CollectionItemSchema),
        },
    } satisfies FastifySchema;

    app.route({
        url: '/get-items-collection',
        method: 'GET',
        schema,
        preHandler: [ authenticateHook ],
        handler: async (
            req: FastifyRequestTypebox<typeof schema>,
            reply: FastifyReplyTypebox<typeof schema>,
        ) => {
            // Fetch items from the database and send the properties matching CollectionItemSchema
            const items = await ItemModel.find({}).select('_id name primaryCategory secondaryCategory averagePrice currentStock abv');

            await reply.send(items.map(item => item.toObject()));
        },
    });

    done();
};
