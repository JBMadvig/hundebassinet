"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookies = setAuthCookies;
exports.clearAuthCookies = clearAuthCookies;
exports.setDeviceCookie = setDeviceCookie;
const isProduction = process.env['NODE_ENV'] === 'production';
function setAuthCookies(reply, accessToken, refreshToken) {
    reply.setCookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/api',
        maxAge: 60 * 60, // 1 hour
    });
    reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
}
function clearAuthCookies(reply) {
    reply.clearCookie('accessToken', { path: '/api' });
    reply.clearCookie('refreshToken', { path: '/api/auth' });
}
function setDeviceCookie(reply, deviceToken) {
    reply.setCookie('deviceToken', deviceToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: 365 * 24 * 60 * 60, // 1 year
    });
}
