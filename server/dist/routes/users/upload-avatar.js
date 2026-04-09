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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const sharp_1 = __importDefault(require("sharp"));
const auth_hooks_1 = require("../../lib/auth-hooks");
const fastify_types_1 = require("../../lib/fastify-types");
const http_errors_1 = require("../../lib/http-errors");
const user_model_1 = require("../../lib/mongodb/models/user.model");
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
exports.default = (function (app, _opts, done) {
    const schema = {
        params: typebox_1.Type.Object({
            id: fastify_types_1.ObjectIdStringType,
        }),
    };
    app.route({
        url: '/:id/avatar',
        method: 'POST',
        schema,
        preHandler: [auth_hooks_1.authenticateHook],
        handler: (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const targetUserId = req.params.id;
            const requestingUser = req.user;
            // Load target user
            const targetUser = yield user_model_1.UserModel.findById(targetUserId);
            if (!targetUser) {
                throw new http_errors_1.NotFoundError('User not found');
            }
            // Authorization
            const isSelf = requestingUser.userId === targetUserId;
            const requestorRole = requestingUser.role;
            if (!isSelf) {
                if (requestorRole === user_model_1.UserRoles.USER) {
                    throw new http_errors_1.ForbiddenError('You can only upload your own avatar');
                }
                if (requestorRole === user_model_1.UserRoles.ADMIN && targetUser.role === user_model_1.UserRoles.SUDO_ADMIN) {
                    throw new http_errors_1.ForbiddenError('Admins cannot modify sudo-admin avatars');
                }
            }
            // Parse multipart file
            const file = yield req.file();
            if (!file) {
                throw new http_errors_1.BadRequestError('No file provided');
            }
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                throw new http_errors_1.BadRequestError('Only JPEG and PNG images are allowed');
            }
            // Read file into buffer
            let buffer;
            try {
                buffer = yield file.toBuffer();
            }
            catch (err) {
                if (err instanceof Error && 'code' in err && err.code === 'FST_REQ_FILE_TOO_LARGE') {
                    throw new http_errors_1.BadRequestError('File too large. Maximum size is 10MB');
                }
                throw err;
            }
            // Resize and convert to WebP
            const processedBuffer = yield (0, sharp_1.default)(buffer)
                .resize(512, 512, { fit: 'cover' })
                .webp({ quality: 80 })
                .toBuffer();
            // Update user document
            targetUser.avatarData = processedBuffer;
            targetUser.avatarMimeType = 'image/webp';
            targetUser.avatarUrl = `/api/users/${targetUserId}/avatar`;
            yield targetUser.save();
            return reply.status(200).send({
                avatarUrl: `/api/users/${targetUserId}/avatar`,
            });
        }),
    });
    done();
});
