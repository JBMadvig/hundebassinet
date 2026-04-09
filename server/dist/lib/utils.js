"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectId = void 0;
exports.delay = delay;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const isObjectId = (tag) => {
    return /^[0-9a-fA-F]{24}$/.test(tag);
};
exports.isObjectId = isObjectId;
