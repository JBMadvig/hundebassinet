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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrTokenModel = exports.QrToken = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const mongoose_1 = __importDefault(require("mongoose"));
let QrToken = class QrToken extends defaultClasses_1.TimeStamps {
};
exports.QrToken = QrToken;
__decorate([
    (0, typegoose_1.prop)({ type: () => String, required: true }),
    __metadata("design:type", String)
], QrToken.prototype, "token", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => mongoose_1.default.Types.ObjectId, required: true, ref: 'User' }),
    __metadata("design:type", mongoose_1.default.Types.ObjectId)
], QrToken.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], QrToken.prototype, "used", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Date, required: true }),
    __metadata("design:type", Date)
], QrToken.prototype, "expiresAt", void 0);
exports.QrToken = QrToken = __decorate([
    (0, typegoose_1.index)({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // MongoDB TTL index for auto-cleanup
], QrToken);
exports.QrTokenModel = (0, typegoose_1.getModelForClass)(QrToken);
