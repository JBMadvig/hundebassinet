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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModel = exports.Item = exports.PrimaryCategories = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
var PrimaryCategories;
(function (PrimaryCategories) {
    PrimaryCategories["BEER"] = "beer";
    PrimaryCategories["CIDER"] = "cider";
    PrimaryCategories["WINE"] = "wine";
    PrimaryCategories["SPIRIT"] = "spirit";
    PrimaryCategories["SODA"] = "soda";
    PrimaryCategories["OTHER"] = "other";
})(PrimaryCategories || (exports.PrimaryCategories = PrimaryCategories = {}));
class Item extends defaultClasses_1.TimeStamps {
}
exports.Item = Item;
__decorate([
    (0, typegoose_1.prop)({ type: () => String, required: true }),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String,
        required: true,
        enum: PrimaryCategories,
        default: PrimaryCategories.OTHER,
    }),
    __metadata("design:type", String)
], Item.prototype, "primaryCategory", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String }),
    __metadata("design:type", String)
], Item.prototype, "secondaryCategory", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, required: false, default: 0, min: 0, max: 100 }),
    __metadata("design:type", Number)
], Item.prototype, "abv", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, required: true, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "volume", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "averagePrice", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "currentStock", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "totalStockValue", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String, sparse: true, unique: true }),
    __metadata("design:type", String)
], Item.prototype, "barcode", void 0);
exports.ItemModel = (0, typegoose_1.getModelForClass)(Item);
