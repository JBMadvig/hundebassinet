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
exports.seedDatabase = seedDatabase;
const user_model_1 = require("./models/user.model");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Checking database seed status...');
        try {
            // Check if sudo-admin user exists
            const sudoAdminExists = yield user_model_1.UserModel.findOne({
                email: 'mail@mail.com',
            });
            if (!sudoAdminExists) {
                console.log('📝 Creating default SUDO Admin user...');
                const sudoAdmin = new user_model_1.UserModel({
                    name: 'SUDO Admin User',
                    email: 'mail@mail.com',
                    password: 'admin123', // Will be hashed by pre-save hook
                    role: user_model_1.UserRoles.SUDO_ADMIN,
                    balance: 0,
                    currency: 'DKK',
                    avatarUrl: 'https://i.pravatar.cc/500?img=1',
                });
                try {
                    yield sudoAdmin.save();
                    console.log('✅ Default SUDO Admin user created successfully');
                }
                catch (error) {
                    // Handle race condition where another instance created the user
                    if (error instanceof Error && 'code' in error && error.code === 11000) {
                        console.log('✅ SUDO Admin user already exists (race condition handled)');
                        return;
                    }
                    throw error;
                }
            }
            else {
                console.log('✅ SUDO Admin user already exists, skipping seed');
            }
        }
        catch (error) {
            console.error('❌ Error seeding database:', error);
            throw error;
        }
    });
}
