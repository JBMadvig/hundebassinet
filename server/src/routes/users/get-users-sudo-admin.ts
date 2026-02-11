import { Type } from '@sinclair/typebox';
import { FastifyPluginCallback, FastifySchema } from 'fastify';

import { requireRole } from '@lib/auth-hooks';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '@lib/fastify-types';
import { UserModel } from '@lib/mongodb/models/user.model';
import { userDashboardSchema } from '@lib/schemas/user.schema';

export default <FastifyPluginCallback>function (app, opts, done) {
    const schema = {
        response: {
            200: Type.Array(userDashboardSchema),
        },
    } satisfies FastifySchema;

    app.route({
        url: '/sudo-admin-data',
        method: 'GET',
        schema,
        preHandler: [ requireRole([ 'sudo-admin' ]) ],
        handler: async (
            req: FastifyRequestTypebox<typeof schema>,
            reply: FastifyReplyTypebox<typeof schema>,
        ) => {
            // Fetch all user data for sudo-admin panel. This is only accessible for sudo-admins, so we can include users with role "sudo-admin"
            const users = await UserModel.find();

            await reply.send(users.map(user => user.toObject()));
        },
    });

    done();
};
