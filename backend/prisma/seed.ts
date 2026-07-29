import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const user = await prisma.user.upsert({
    where: { email: 'admin@ordo.gg' },
    update: {},
    create: {
      email: 'admin@ordo.gg',
      name: 'System Admin',
      passwordHash: 'hashed_password_placeholder',
      role: 'admin',
    },
  });
  console.log('Seed completed successfully. Created user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
