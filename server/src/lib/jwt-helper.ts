import { FastifyReply, FastifyRequest } from 'fastify';

import { UnauthorizedError } from './http-errors';
import { UserDocument } from './mongodb/models/user.model';

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    type: 'access' | 'refresh'; // Token type to differentiate
}

export async function verifyAccessToken(request: FastifyRequest): Promise<JWTPayload> {
    try {
        const payload = await request.jwtVerify<JWTPayload>();
        if (payload.type !== 'access') {
            throw new UnauthorizedError('Invalid token type');
        }
        return payload;
    } catch (error) {
        throw new UnauthorizedError('Invalid or expired access token');
    }
}

export async function verifyRefreshToken(request: FastifyRequest): Promise<JWTPayload> {
    try {
        const payload = await request.jwtVerify<JWTPayload>();
        if (payload.type !== 'refresh') {
            throw new UnauthorizedError('Invalid token type');
        }
        return payload;
    } catch (error) {
        throw new UnauthorizedError('Invalid or expired refresh token');
    }
}

export async function generateTokens(reply: FastifyReply, user: UserDocument) {
    const basePayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    // Generate access token (15 minutes)
    const accessToken = await reply.jwtSign(
        { ...basePayload, type: 'access' as const },
        { expiresIn: '15m' },
    );

    // Generate refresh token (7 days)
    const refreshToken = await reply.jwtSign(
        { ...basePayload, type: 'refresh' as const },
        { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
}
