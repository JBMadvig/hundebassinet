"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.UserModel = exports.User = exports.UserRoles = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const bcrypt_1 = __importDefault(require("bcrypt"));
var UserRoles;
(function (UserRoles) {
    UserRoles["ADMIN"] = "admin";
    UserRoles["USER"] = "user";
    UserRoles["SUDO_ADMIN"] = "sudo-admin";
})(UserRoles || (exports.UserRoles = UserRoles = {}));
let User = class User extends defaultClasses_1.TimeStamps {
    // Method to compare password
    comparePassword(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(candidatePassword, this.password);
        });
    }
};
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({ type: () => String, required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String, required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String, required: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String, required: true, enum: UserRoles, default: UserRoles.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "balance", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String, required: true, default: 'DKK' }),
    __metadata("design:type", String)
], User.prototype, "currency", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "tokenVersion", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String, required: false, default: '' }),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Buffer, select: false }),
    __metadata("design:type", Buffer)
], User.prototype, "avatarData", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String, select: false }),
    __metadata("design:type", String)
], User.prototype, "avatarMimeType", void 0);
exports.User = User = __decorate([
    (0, typegoose_1.pre)('save', function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Only hash the password if it has been modified (or is new)
            if (!this.isModified('password'))
                return next();
            try {
                const salt = yield bcrypt_1.default.genSalt(10);
                this.password = yield bcrypt_1.default.hash(this.password, salt);
                next();
            }
            catch (error) {
                next(error);
            }
        });
    })
], User);
exports.UserModel = (0, typegoose_1.getModelForClass)(User);
