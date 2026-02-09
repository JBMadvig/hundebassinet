import { FastifyReply, FastifyRequest, preHandlerAsyncHookHandler } from 'fastify';

import { ForbiddenError } from './http-errors';
import { JWTPayload, verifyAccessToken } from './jwt-helper';

// Extend @fastify/jwt to type the user payload
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: JWTPayload;
        user: JWTPayload;
    }
}

/**
 * Fastify preHandler hook to authenticate requests
 * Verifies JWT access token and attaches user payload to request
 */
export const authenticateHook: preHandlerAsyncHookHandler = async (
    request: FastifyRequest,
    _reply: FastifyReply,
) => {
    const payload = await verifyAccessToken(request);
    request.user = payload;
};

/**
 * Factory function to create a role-based authorization hook
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export function requireRole(allowedRoles: string[]): preHandlerAsyncHookHandler {
    return async (request: FastifyRequest, _reply: FastifyReply) => {
        const payload = await verifyAccessToken(request);
        request.user = payload;

        if (!allowedRoles.includes(payload.role)) {
            throw new ForbiddenError('Insufficient permissions');
        }
    };
}
