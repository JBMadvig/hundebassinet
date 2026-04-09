"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPVersionNotSupportedError = exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.BadGatewayError = exports.NotImplementedError = exports.InternalServerError = exports.UnavailableForLegalReasonsError = exports.RequestHeaderFieldsTooLargeError = exports.TooManyRequestsError = exports.PreconditionRequiredError = exports.UpgradeRequiredError = exports.TooEarlyError = exports.FailedDependencyError = exports.LockedError = exports.UnprocessableEntityError = exports.MisdirectedRequestError = exports.TeapotError = exports.ExpectationFailedError = exports.RangeNotSatisfiableError = exports.UnsupportedMediaTypeError = exports.URITooLongError = exports.PayloadTooLargeError = exports.PreconditionFailedError = exports.LengthRequiredError = exports.GoneError = exports.ConflictError = exports.RequestTimeoutError = exports.ProxyAuthenticationRequiredError = exports.NotAcceptableError = exports.MethodNotAllowedError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.HttpError = exports.httpErrorHandler = exports.errorisErrnoException = exports.notFoundHandler = void 0;
const notFoundHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    yield reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Endpoint not found',
    });
});
exports.notFoundHandler = notFoundHandler;
const errorisErrnoException = (error) => {
    return error instanceof Error && 'code' in error;
};
exports.errorisErrnoException = errorisErrnoException;
const httpErrorHandler = (error, request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    if (error.code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE') {
        yield reply.code(415).send({
            statusCode: 415,
            error: 'Unsupported Media Type',
            message: 'Unsupported media type',
        });
        return;
    }
    if (error.code === 'FST_ERR_CTP_EMPTY_JSON_BODY') {
        yield reply.code(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Empty JSON body',
        });
        return;
    }
    if (error.code === 'FST_REQ_FILE_TOO_LARGE') {
        yield reply.code(413).send({
            statusCode: 413,
            error: 'Payload Too Large',
            message: 'File too large',
        });
        return;
    }
    if (error.code === 'FST_ERR_VALIDATION') {
        yield reply.code(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Validation error',
            data: error.validation,
        });
        return;
    }
    if (error instanceof HttpError) {
        if (error.status >= 500) {
            console.error('Interal error - ', error);
        }
        yield reply.code(error.status).send({
            statusCode: error.status,
            error: error.name,
            message: error.message,
            data: error.data ? error.data : undefined,
        });
        return;
    }
    console.log('Interal non-http error - ', error);
    yield reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred',
    });
});
exports.httpErrorHandler = httpErrorHandler;
class HttpError extends Error {
    constructor(name = 'HttpError', message, status, data = null) {
        super(message);
        this.name = name;
        this.status = status;
        this.data = Object.keys(data !== null && data !== void 0 ? data : {}).length ? data : null;
    }
}
exports.HttpError = HttpError;
class BadRequestError extends HttpError {
    constructor(message = 'Bad Request', data = null) {
        super('Bad Request', message, 400, data);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized', data = null) {
        super('Unauthorized', message, 401, data);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden', data = null) {
        super('Forbidden', message, 403, data);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends HttpError {
    constructor(message = 'Not Found', data = null) {
        super('Not Found', message, 404, data);
    }
}
exports.NotFoundError = NotFoundError;
class MethodNotAllowedError extends HttpError {
    constructor(message = 'Method Not Allowed', data = null) {
        super('Method Not Allowed', message, 405, data);
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
class NotAcceptableError extends HttpError {
    constructor(message = 'Not Acceptable', data = null) {
        super('Not Acceptable', message, 406, data);
    }
}
exports.NotAcceptableError = NotAcceptableError;
class ProxyAuthenticationRequiredError extends HttpError {
    constructor(message = 'Proxy Authentication Required', data = null) {
        super('Proxy Authentication Required', message, 407, data);
    }
}
exports.ProxyAuthenticationRequiredError = ProxyAuthenticationRequiredError;
class RequestTimeoutError extends HttpError {
    constructor(message = 'Request Timeout', data = null) {
        super('Request Timeout', message, 408, data);
    }
}
exports.RequestTimeoutError = RequestTimeoutError;
class ConflictError extends HttpError {
    constructor(message = 'Conflict', data = null) {
        super('Conflict', message, 409, data);
    }
}
exports.ConflictError = ConflictError;
class GoneError extends HttpError {
    constructor(message = 'Gone', data = null) {
        super('Gone', message, 410, data);
    }
}
exports.GoneError = GoneError;
class LengthRequiredError extends HttpError {
    constructor(message = 'Length Required', data = null) {
        super('Length Required', message, 411, data);
    }
}
exports.LengthRequiredError = LengthRequiredError;
class PreconditionFailedError extends HttpError {
    constructor(message = 'Precondition Failed', data = null) {
        super('Precondition Failed', message, 412, data);
    }
}
exports.PreconditionFailedError = PreconditionFailedError;
class PayloadTooLargeError extends HttpError {
    constructor(message = 'Payload Too Large', data = null) {
        super('Payload Too Large', message, 413, data);
    }
}
exports.PayloadTooLargeError = PayloadTooLargeError;
class URITooLongError extends HttpError {
    constructor(message = 'URI Too Long', data = null) {
        super('URI Too Long', message, 414, data);
    }
}
exports.URITooLongError = URITooLongError;
class UnsupportedMediaTypeError extends HttpError {
    constructor(message = 'Unsupported Media Type', data = null) {
        super('Unsupported Media Type', message, 415, data);
    }
}
exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
class RangeNotSatisfiableError extends HttpError {
    constructor(message = 'Range Not Satisfiable', data = null) {
        super('Range Not Satisfiable', message, 416, data);
    }
}
exports.RangeNotSatisfiableError = RangeNotSatisfiableError;
class ExpectationFailedError extends HttpError {
    constructor(message = 'Expectation Failed', data = null) {
        super('Expectation Failed', message, 417, data);
    }
}
exports.ExpectationFailedError = ExpectationFailedError;
class TeapotError extends HttpError {
    constructor(message = 'I am a teapot', data = null) {
        super('I am a teapot', message, 418, data);
    }
}
exports.TeapotError = TeapotError;
class MisdirectedRequestError extends HttpError {
    constructor(message = 'Misdirected Request', data = null) {
        super('Misdirected Request', message, 421, data);
    }
}
exports.MisdirectedRequestError = MisdirectedRequestError;
class UnprocessableEntityError extends HttpError {
    constructor(message = 'Unprocessable Entity', data = null) {
        super('Unprocessable Entity', message, 422, data);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class LockedError extends HttpError {
    constructor(message = 'Locked', data = null) {
        super('Locked', message, 423, data);
    }
}
exports.LockedError = LockedError;
class FailedDependencyError extends HttpError {
    constructor(message = 'Failed Dependency', data = null) {
        super('Failed Dependency', message, 424, data);
    }
}
exports.FailedDependencyError = FailedDependencyError;
class TooEarlyError extends HttpError {
    constructor(message = 'Too Early', data = null) {
        super('Too Early', message, 425, data);
    }
}
exports.TooEarlyError = TooEarlyError;
class UpgradeRequiredError extends HttpError {
    constructor(message = 'Upgrade Required', data = null) {
        super('Upgrade Required', message, 426, data);
    }
}
exports.UpgradeRequiredError = UpgradeRequiredError;
class PreconditionRequiredError extends HttpError {
    constructor(message = 'Precondition Required', data = null) {
        super('Precondition Required', message, 428, data);
    }
}
exports.PreconditionRequiredError = PreconditionRequiredError;
class TooManyRequestsError extends HttpError {
    constructor(message = 'Too Many Requests', data = null) {
        super('Too Many Requests', message, 429, data);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class RequestHeaderFieldsTooLargeError extends HttpError {
    constructor(message = 'Request Header Fields Too Large', data = null) {
        super('Request Header Fields Too Large', message, 431, data);
    }
}
exports.RequestHeaderFieldsTooLargeError = RequestHeaderFieldsTooLargeError;
class UnavailableForLegalReasonsError extends HttpError {
    constructor(message = 'Unavailable For Legal Reasons', data = null) {
        super('Unavailable For Legal Reasons', message, 451, data);
    }
}
exports.UnavailableForLegalReasonsError = UnavailableForLegalReasonsError;
class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error', data = null) {
        super('Internal Server Error', message, 500, data);
    }
}
exports.InternalServerError = InternalServerError;
class NotImplementedError extends HttpError {
    constructor(message = 'Not Implemented', data = null) {
        super('Not Implemented', message, 501, data);
    }
}
exports.NotImplementedError = NotImplementedError;
class BadGatewayError extends HttpError {
    constructor(message = 'Bad Gateway', data = null) {
        super('Bad Gateway', message, 502, data);
    }
}
exports.BadGatewayError = BadGatewayError;
class ServiceUnavailableError extends HttpError {
    constructor(message = 'Service Unavailable', data = null) {
        super('Service Unavailable', message, 503, data);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class GatewayTimeoutError extends HttpError {
    constructor(message = 'Gateway Timeout', data = null) {
        super('Gateway Timeout', message, 504, data);
    }
}
exports.GatewayTimeoutError = GatewayTimeoutError;
class HTTPVersionNotSupportedError extends HttpError {
    constructor(message = 'HTTP Version Not Supported', data = null) {
        super('HTTP Version Not Supported', message, 505, data);
    }
}
exports.HTTPVersionNotSupportedError = HTTPVersionNotSupportedError;
