import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, role: 'admin' }
  });

  // Clear old items
  await prisma.item.deleteMany();

  // Seed fresh items
  await prisma.item.createMany({
    data: [
      { name: "Dhoni", age: 36, role: "Captain", ownerId: admin.id },
      { name: "Virat", age: 30, role: "Vice Captain", ownerId: admin.id },
      { name: "Yuvraj", age: 25, role: "Batter", ownerId: admin.id }
    ]
  });

  console.log('✅ Seeded admin@example.com with 3 initial items');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
