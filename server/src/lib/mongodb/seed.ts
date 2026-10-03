import { ItemModel } from './models/item.model';
import { UserModel, UserRoles } from './models/user.model';
import { seedItems } from './seed-data/items';

async function seedMockItems() {
    // Never seed mock items into a production database
    if (process.env['NODE_ENV'] === 'production') {
        return;
    }

    const itemCount = await ItemModel.estimatedDocumentCount();
    if (itemCount > 0) {
        console.log('✅ Items already exist, skipping item seed');
        return;
    }

    console.log(`📝 Seeding ${seedItems.length} mock items...`);

    await ItemModel.bulkWrite(
        seedItems.map(item => ({
            insertOne: {
                document: {
                    ...item,
                    totalStockValue: item.averagePrice * item.currentStock,
                },
            },
        })),
        { timestamps: false }, // Preserve the createdAt/updatedAt dates from seedItems
    );

    console.log('✅ Mock items seeded successfully');
}

export async function seedDatabase() {
    console.log('🌱 Checking database seed status...');

    try {
        // Check if sudo-admin user exists
        const sudoAdminExists = await UserModel.findOne({
            email: 'mail@mail.com',
        });

        if (!sudoAdminExists) {
            console.log('📝 Creating default SUDO Admin user...');

            const sudoAdmin = new UserModel({
                name: 'SUDO Admin User',
                email: 'mail@mail.com',
                password: 'admin123', // Will be hashed by pre-save hook
                role: UserRoles.SUDO_ADMIN,
                balance: 0,
                currency: 'DKK',
                avatarUrl: 'https://i.pravatar.cc/500?img=1',
            });

            try {
                await sudoAdmin.save();
                console.log('✅ Default SUDO Admin user created successfully');
            } catch (error: unknown) {
                // Handle race condition where another instance created the user
                if (error instanceof Error && 'code' in error && error.code === 11000) {
                    console.log('✅ SUDO Admin user already exists (race condition handled)');
                    return;
                }
                throw error;
            }
        } else {
            console.log('✅ SUDO Admin user already exists, skipping seed');
        }

        await seedMockItems();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}
