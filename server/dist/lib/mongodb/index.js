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
exports.connectToMongoDB = connectToMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
const seed_1 = require("./seed");
const mongooseUrl = process.env['MONGODB_URL'];
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongooseUrl) {
            throw new Error('MONGODB_URL environment variable is not set');
        }
        yield mongoose_1.default.connect(mongooseUrl);
        console.log('📦 Connected to MongoDB');
        // Seed database with default data
        yield (0, seed_1.seedDatabase)();
    });
}
