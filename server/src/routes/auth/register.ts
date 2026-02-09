import { FastifyPluginCallback, FastifySchema } from 'fastify';
import { MongoServerError } from 'mongodb';

import { FastifyReplyTypebox, FastifyRequestTypebox } from '@lib/fastify-types';
import { ConflictError, InternalServerError } from '@lib/http-errors';
import { generateTokens } from '@lib/jwt-helper';
import { UserModel } from '@lib/mongodb/models/user.model';
import { authResponseSchema, registerRequestSchema } from '@lib/schemas/user.schema';

export default <FastifyPluginCallback>function (app, opts, done) {
    const schema = {
        body: registerRequestSchema,
        response: {
            200: authResponseSchema,
        },
    } satisfies FastifySchema;

    app.route({
        url: '/register',
        method: 'POST',
        schema,
        handler: async (
            req: FastifyRequestTypebox<typeof schema>,
            reply: FastifyReplyTypebox<typeof schema>,
        ) => {
            const { email, name, password } = req.body;

            // Check if user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new ConflictError('User with this email already exists');
            }

            // Create new user (password will be hashed by pre-save hook)
            const newUser = new UserModel({
                email,
                name,
                password,
                role: 'user', // default role
                balance: 0,
                valuta: 'DKK',
                avatarUrl: '',
            });

            try {
                await newUser.save();
            } catch (error) {
                if (error instanceof MongoServerError && error.code === 11000) {
                    throw new ConflictError('User with this email already exists');
                }
                console.error('Error creating user:', error);
                throw new InternalServerError();
            }

            // Generate tokens
            const { accessToken, refreshToken } = await generateTokens(reply, newUser);

            // Return user without password
            const userResponse = newUser.toObject();
            delete userResponse.password;

            await reply.send({
                accessToken,
                refreshToken,
                user: userResponse,
            });
        },
    });

    done();
};
