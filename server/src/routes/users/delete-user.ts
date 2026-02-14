import { Type } from '@sinclair/typebox';
import { FastifyPluginCallback, FastifySchema } from 'fastify';

import { requireRole } from '@lib/auth-hooks';
import { FastifyReplyTypebox, FastifyRequestTypebox, ObjectIdStringType } from '@lib/fastify-types';
import { NotFoundError } from '@lib/http-errors';
import { UserModel } from '@lib/mongodb/models/user.model';

export default <FastifyPluginCallback>function (app, opts, done) {
    const schema = {
        params: Type.Object({
            userId: ObjectIdStringType,
        }),
        response: {
            204: Type.Never(),
        },
    } satisfies FastifySchema;

    app.route({
        url: '/:userId/delete',
        method: 'DELETE',
        schema,
        preHandler: [ requireRole([ 'admin', 'sudo-admin' ]) ],
        handler: async (
            req: FastifyRequestTypebox<typeof schema>,
            reply: FastifyReplyTypebox<typeof schema>,
        ) => {

            const doc = await UserModel.findByIdAndDelete(req.params.userId).exec();

            if (!doc) throw new NotFoundError('Document not found');

            await reply.status(204).send();
        },
    });

    done();
};
